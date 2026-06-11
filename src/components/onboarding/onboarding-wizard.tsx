"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/brand/logo";
import { completeOnboarding } from "@/app/onboarding/actions";
import {
  createInitialState,
  type DraftProduct,
  type OnboardingState,
  type SetupMethod,
} from "@/components/onboarding/types";
import type { ExtractedStore, PlanId } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { StepMethod } from "@/components/onboarding/steps/step-method";
import { StepImport } from "@/components/onboarding/steps/step-import";
import { StepDetails } from "@/components/onboarding/steps/step-details";
import { StepTemplate } from "@/components/onboarding/steps/step-template";
import { StepPlan } from "@/components/onboarding/steps/step-plan";

type Step = "method" | "import" | "details" | "template" | "plan";

const PROGRESS = [
  { key: "method", label: "Metode" },
  { key: "details", label: "Detail Toko" },
  { key: "template", label: "Tampilan" },
  { key: "plan", label: "Paket" },
];

function progressIndex(step: Step): number {
  if (step === "method") return 0;
  if (step === "import" || step === "details") return 1;
  if (step === "template") return 2;
  return 3;
}

function newProduct(partial?: Partial<DraftProduct>): DraftProduct {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
    stock: 0,
    aiImported: false,
    ...partial,
  };
}

export function OnboardingWizard({ firstName }: { firstName: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("method");
  const [state, setState] = useState<OnboardingState>(createInitialState);
  const [submitting, setSubmitting] = useState(false);

  const updateStore = (partial: Partial<OnboardingState["store"]>) =>
    setState((s) => ({ ...s, store: { ...s.store, ...partial } }));

  // --- Step transitions -----------------------------------------------------
  function handleSelectMethod(method: SetupMethod) {
    setState((s) => ({ ...s, setupMethod: method }));
    if (method === "import") {
      setStep("import");
    } else {
      // Seed a single empty product for manual setup.
      setState((s) => ({
        ...s,
        setupMethod: method,
        products: s.products.length ? s.products : [newProduct()],
      }));
      setStep("details");
    }
  }

  function handleExtracted(data: ExtractedStore, url: string) {
    setState((s) => ({
      ...s,
      importSourceUrl: url,
      sourcePlatform: data.source_platform,
      store: {
        ...s.store,
        name: data.name,
        description: data.description,
        logoUrl: data.logo_url,
        brandColor: data.brand_color,
        subdomain: slugify(data.name),
      },
      products: data.products.map((p) =>
        newProduct({
          name: p.name,
          description: p.description,
          price: p.price,
          compareAtPrice: p.compare_at_price,
          imageUrl: p.image_url,
          stock: p.stock,
          aiImported: true,
        }),
      ),
    }));
    setStep("details");
  }

  // --- Product editing ------------------------------------------------------
  const updateProduct = (id: string, partial: Partial<DraftProduct>) =>
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, ...partial } : p)),
    }));

  const addProduct = () =>
    setState((s) => ({ ...s, products: [...s.products, newProduct()] }));

  const removeProduct = (id: string) =>
    setState((s) => ({
      ...s,
      products: s.products.filter((p) => p.id !== id),
    }));

  const selectPlan = (plan: PlanId) => setState((s) => ({ ...s, plan }));

  // --- Submit ---------------------------------------------------------------
  async function handleFinish() {
    setSubmitting(true);
    try {
      const result = await completeOnboarding({
        setupMethod: state.setupMethod ?? "manual",
        importSourceUrl: state.importSourceUrl || null,
        store: {
          ...state.store,
          subdomain: state.store.subdomain || slugify(state.store.name),
        },
        products: state.products.map((p) => ({
          name: p.name,
          description: p.description,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          imageUrl: p.imageUrl,
          stock: p.stock,
          aiImported: p.aiImported,
        })),
        plan: state.plan,
      });

      if (!result.ok) {
        toast.error(result.error ?? "Gagal menyimpan. Coba lagi.");
        setSubmitting(false);
        return;
      }

      toast.success("Tokomu sudah siap! 🎉");
      router.push("/dashboard");
      router.refresh();
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
      setSubmitting(false);
    }
  }

  const currentIndex = progressIndex(step);

  return (
    <div className="min-h-screen">
      {/* Header + progress */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-3.5">
          <Logo />
          <div className="hidden flex-1 items-center justify-center gap-1.5 sm:flex">
            {PROGRESS.map((p, i) => {
              const done = i < currentIndex;
              const active = i === currentIndex;
              return (
                <div key={p.key} className="flex items-center gap-1.5">
                  <span
                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition-colors ${
                      done
                        ? "bg-success text-success-foreground"
                        : active
                          ? "bg-magenta text-magenta-foreground"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      active ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {p.label}
                  </span>
                  {i < PROGRESS.length - 1 && (
                    <span
                      className={`mx-1.5 h-px w-6 ${
                        done ? "bg-success" : "bg-border"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          <span className="hidden text-sm text-muted-foreground md:inline">
            Hai, {firstName} 👋
          </span>
        </div>
        {/* Mobile progress bar */}
        <div className="h-1 w-full bg-secondary sm:hidden">
          <motion.div
            className="h-full bg-magenta"
            initial={false}
            animate={{ width: `${((currentIndex + 1) / 4) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            {step === "method" && <StepMethod onSelect={handleSelectMethod} />}

            {step === "import" && (
              <StepImport
                initialUrl={state.importSourceUrl}
                onExtracted={handleExtracted}
                onBack={() => setStep("method")}
              />
            )}

            {step === "details" && (
              <StepDetails
                store={state.store}
                products={state.products}
                isImport={state.setupMethod === "import"}
                sourcePlatform={state.sourcePlatform}
                onStoreChange={updateStore}
                onProductChange={updateProduct}
                onAddProduct={addProduct}
                onRemoveProduct={removeProduct}
                onNext={() => setStep("template")}
                onBack={() =>
                  setStep(state.setupMethod === "import" ? "import" : "method")
                }
              />
            )}

            {step === "template" && (
              <StepTemplate
                store={state.store}
                products={state.products}
                onStoreChange={updateStore}
                onNext={() => setStep("plan")}
                onBack={() => setStep("details")}
              />
            )}

            {step === "plan" && (
              <StepPlan
                selected={state.plan}
                onSelect={selectPlan}
                onFinish={handleFinish}
                onBack={() => setStep("template")}
                submitting={submitting}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
