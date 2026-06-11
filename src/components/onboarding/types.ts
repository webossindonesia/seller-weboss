import type { PlanId } from "@/lib/types";

export type SetupMethod = "import" | "manual";

export interface DraftProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  stock: number;
  aiImported: boolean;
}

export interface OnboardingState {
  setupMethod: SetupMethod | null;
  importSourceUrl: string;
  sourcePlatform: string | null;
  store: {
    name: string;
    description: string;
    logoUrl: string;
    brandColor: string;
    templateId: string;
    subdomain: string;
  };
  products: DraftProduct[];
  plan: PlanId;
}

export const DEFAULT_BRAND_COLOR = "#d6266f";

export function createInitialState(): OnboardingState {
  return {
    setupMethod: null,
    importSourceUrl: "",
    sourcePlatform: null,
    store: {
      name: "",
      description: "",
      logoUrl: "",
      brandColor: DEFAULT_BRAND_COLOR,
      templateId: "aurora",
      subdomain: "",
    },
    products: [],
    plan: "basic",
  };
}

/** Payload sent to the completeOnboarding server action. */
export interface CompleteOnboardingPayload {
  setupMethod: SetupMethod;
  importSourceUrl: string | null;
  store: OnboardingState["store"];
  products: Omit<DraftProduct, "id">[];
  plan: PlanId;
}
