# IPSentinel backend

Run locally from the repository root:

```powershell
py -m venv backend/.venv
backend/.venv/Scripts/pip install -r backend/requirements.txt
Copy-Item backend/.env.example backend/.env
uvicorn backend.main:app --reload --port 8000
```

Set `GROQ_API_KEY`, `GEMINI_API_KEY`, and `TAVILY_API_KEY` in `backend/.env`, then set
`NEXT_PUBLIC_API_URL=http://localhost:8000` in `frontend/.env.local`.

Patent novelty uses live US Google Patents records discovered through Tavily Search.
PatentsView was not used because its current search API requires a key.
