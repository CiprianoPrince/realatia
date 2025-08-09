"use client";

import { useRouter } from "next/router";
import { useEffect } from "react";

const OnboardingPage = () => {
  const { push } = useRouter();

  console.log("object");

  useEffect(() => {
    push("/onboarding/local-chapter");
  }, []);
};

export default OnboardingPage;
