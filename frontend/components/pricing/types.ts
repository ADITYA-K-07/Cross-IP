export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period?: string;
  description: string;
  recommended?: boolean;
  features: PricingFeature[];
  buttonText: string;
  buttonIcon: string;
  buttonVariant: "primary" | "outline";
}
