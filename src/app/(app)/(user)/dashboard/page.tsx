"use client"
import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { dashboardPageConfig } from "@/app/(app)/(user)/dashboard/_constants/page-config";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ActivityIcon,
    CreditCardIcon,
    DollarSignIcon,
    Users2Icon,
} from "lucide-react";

import { useMultiStep } from "@/components/Stepper/useMultiStep";
import { Stepper } from "@/components/Stepper/Stepper";
import { StepProfileInput } from "@/components/Stepper/StepProfileInput";
import { StepPostSelection } from "@/components/Stepper/StepPostSelection";
import { StepAnalysisResult } from "@/components/Stepper/StepAnalysisResult";
import { useState } from "react";
import { Post } from "@/components/Stepper/PostCard";

const steps = ["profiles", "posts", "analysis"] as const;
type Step = typeof steps[number];

export default function DashboardPage() {

    const {
        step,
        setStep,
        next,
        back,
        steps,
      } = useMultiStep();
      
      const [profileData, setProfileData] = useState({ me: "", competitor: "" });
      const [selectedPosts, setSelectedPosts] = useState<Post[]>([]);
      const mockPosts = Array.from({ length: 6 }).map((_, i) => ({
        id: i,
        text: `Post ${i + 1} de exemplo com legenda simulada.`,
      }));
      
      const mockAnalysis = {
        style: "Textos curtos com emojis",
        hashtags: ["#estratégia", "#marketing", "#postmixai"],
        frequency: "3 posts por semana",
      };

      const handleStepClick = (s: string) => {
        if (steps.includes(s as Step)) {
          setStep(s as Step);
        }
      };
      

    return (
        <AppPageShell
            title={dashboardPageConfig.title}
            description={dashboardPageConfig.description}
        >
            <div className="space-y-4 mt-6">
  <Stepper currentStep={step} steps={steps} onStepClick={handleStepClick} />

  {step === "profiles" && (
    <StepProfileInput
      onSubmit={(data) => {
        setProfileData(data);
        next();
      }}
    />
  )}

  {step === "posts" && (
    <StepPostSelection
      posts={mockPosts}
      onNext={(selected) => {
        setSelectedPosts(selected);
        next();
      }}
    />
  )}

  {step === "analysis" && (
    <StepAnalysisResult
      data={mockAnalysis}
      onGenerate={() => {
        // lógica para gerar conteúdo IA
        console.log("Gerar conteúdo com base nos dados");
      }}
    />
  )}
</div>

        </AppPageShell>
    );
}
