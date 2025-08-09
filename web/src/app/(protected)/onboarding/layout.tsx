"use client";

import { Button } from "@/shared/components";
import { cn } from "@/shared/lib";
import { Building, X } from "lucide-react";
import { usePathname } from "next/navigation";

const STEP_MAP: Record<string, number> = {
  "/onboarding/local-chapter": 1,
  "/onboarding/business-details": 2,
  "/onboarding/service-categories": 3,
  "/onboarding/preferences": 4,
  "/onboarding/portfolio": 5,
  "/onboarding/subscription-plan": 6,
  "/onboarding/payment-details": 7,
  "/onboarding/welcome-success": 8,
} as const;

const OnboardingLayout = () => {
  const pathname = usePathname();
  const currentStep = STEP_MAP[pathname] || 1;
  const stepValues = Object.values(STEP_MAP);

  return (
    <div className="bg-slate-50 h-screen">
      <div className="bg-white shadow">
        <div className="mx-28 py-4">
          <div className="flex flex-col gap-y-4">
            <div>
              <div className="flex flex-row justify-between items-center">
                <div>
                  <Building />
                </div>

                <div>
                  <div className="flex flex-row gap-x-2 items-center justify-center">
                    <Button variant="ghost">
                      <X className="size-4" /> Exit Setup
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-row justify-between items-center">
                <div className="self-stretch">
                  <div className="h-full flex flex-row gap-x-2">
                    {stepValues.map((value) => (
                      <div
                        key={value}
                        className={cn(
                          "h-9 aspect-square bg-blue-500 text-white rounded-full",
                          currentStep === value
                            ? "bg-blue-500 text-white"
                            : "bg-blue-50 ring-2 ring-inset ring-blue-100 text-gray-600"
                        )}
                      >
                        <div className="h-full w-full grid place-content-center">
                          <span className="font-medium">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex flex-row items-center justify-center">
                    <span className="text-gray-700">
                      Step {currentStep} of {stepValues.length - 1}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-80 py-12">
        <div className="rounded-lg bg-white p-8 shadow">
          <div className="flex flex-col gap-y-8 ">
            <div>
              <h1>Select Your Local Chapter {pathname}</h1>
              <p>
                Choose the chapters you'd like to join. You can select multiple
                chapters if you operate in different regions.
              </p>
            </div>

            <section></section>

            <section></section>

            <section></section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingLayout;
