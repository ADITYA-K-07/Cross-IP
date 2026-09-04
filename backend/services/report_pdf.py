"""Stateless PDF rendering for a completed, client-supplied validated report."""

from __future__ import annotations

from html import escape
from io import BytesIO

from backend.models.schemas import CrossIpReport


def render_report_pdf(report: CrossIpReport) -> bytes:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib.units import cm
    from reportlab.platypus import PageBreak, Paragraph, SimpleDocTemplate, Spacer

    buffer = BytesIO()
    document = SimpleDocTemplate(buffer, pagesize=A4, leftMargin=1.6 * cm, rightMargin=1.6 * cm, topMargin=1.5 * cm, bottomMargin=1.5 * cm)
    styles = getSampleStyleSheet()
    styles["Title"].textColor = colors.HexColor("#4c1d95")
    story = [Paragraph("CrossIP Cross-IP Risk Report", styles["Title"])]
    story.append(Paragraph(f"Unified risk score: <b>{report.unified_score}/100 — {report.risk_label}</b>", styles["Heading2"]))
    story.append(Paragraph(escape(report.executive_summary), styles["BodyText"]))
    story.append(Spacer(1, 12))
    for domain in report.domains:
        story.append(Paragraph(f"{domain.agent_name}: {domain.score}/100", styles["Heading2"]))
        story.append(Paragraph(escape(domain.reasoning), styles["BodyText"]))
        if domain.revision_reason:
            story.append(Paragraph(f"Revised after debate: {escape(domain.revision_reason)}", styles["BodyText"]))
    story.append(Paragraph("Opinions & Tips", styles["Heading2"]))
    for tip in report.opinions_and_tips:
        story.append(Paragraph(f"• {escape(tip)}", styles["BodyText"]))
    story.append(PageBreak())
    story.append(Paragraph("Agent Debate Transcript", styles["Heading1"]))
    for entry in report.transcript:
        story.append(Paragraph(f"<b>Round {entry.round} · {escape(entry.agent)}</b><br/>{escape(entry.message)}", styles["BodyText"]))
        story.append(Spacer(1, 6))
    story.append(Paragraph("Evidence Appendix", styles["Heading1"]))
    for source in report.evidence:
        story.append(Paragraph(f"<b>{escape(source.source_id)} — {escape(source.title)}</b><br/>{escape(source.excerpt)}", styles["BodyText"]))
        story.append(Spacer(1, 5))
    document.build(story)
    return buffer.getvalue()
