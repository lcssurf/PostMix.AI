"use client";

import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { dashboardPageConfig } from "@/app/(app)/(user)/dashboard/_constants/page-config";
import { useState } from "react";
import { useMultiStep } from "@/components/Stepper/useMultiStep";
import { VerticalStepIndicator } from "@/components/Stepper/VerticalStepIndicator";
import { StepProfileInput } from "@/components/Stepper/StepProfileInput";
import { StepPostSelection } from "@/components/Stepper/StepPostSelection";
import { StepGoal } from "@/components/Stepper/StepGoal";
import { StepNiche } from "@/components/Stepper/StepNiche";
import { StepAudience } from "@/components/Stepper/StepAudience";
import { StepTone } from "@/components/Stepper/StepTone";
import { StepFormat } from "@/components/Stepper/StepFormat";

export default function DashboardPage() {
  const { stepIndex, steps, next, isStepEnabled } = useMultiStep();

  const [referenceProfile, setReferenceProfile] = useState<any | null>(null);
  const [referencePosts, setReferencePosts] = useState<any[]>([]);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [referenceUsername, setReferenceUsername] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<any[]>([]);
  const [goal, setGoal] = useState("");
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [format, setFormat] = useState("");


  const fetchReferenceProfile = async (username: string) => {
    setIsLoadingProfile(true);
    setProfileError("");
  
    try {
      const res = await fetch(`/api/instagram?username=${username}`);
      const data = await res.json();
  
      if (!res.ok) throw new Error(data?.error || "Erro inesperado");
  
      setReferenceProfile(data);
      
      console.log("Perfil de referência:", data);
      
      setReferencePosts(data.posts || []);
      setReferenceUsername(username);
      next();
    } catch (err: any) {
      setProfileError(err.message || "Erro ao buscar perfil.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  
  return (
    <AppPageShell title={dashboardPageConfig.title} description={dashboardPageConfig.description}>
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <VerticalStepIndicator steps={steps} currentIndex={stepIndex} />

        <div className="flex-1 space-y-6">
          <StepProfileInput
            onSubmit={({ competitor }) => {

              if (!isStepEnabled(0) || referenceUsername) return;
              fetchReferenceProfile(competitor);
              
            }}
            disabled={!isStepEnabled(0)}
          />

          <StepPostSelection
            posts={[]} // substituir com posts reais futuramente
            onNext={(posts) => {

              if (!isStepEnabled(1) || selectedPosts.length) return;

              setSelectedPosts(posts);
              next();
            }}
            disabled={!isStepEnabled(1)}
          />

          <StepGoal
            value={goal}
            onSelect={(g) => {

              if (!isStepEnabled(2) || goal) return;

              setGoal(g);
              next();
            }}
            disabled={!isStepEnabled(2)}
          />

          <StepNiche
            defaultValue={niche}
            onNext={(n) => {
              if (!isStepEnabled(3) || niche) return;
              setNiche(n);
              next();
            }}
            disabled={!isStepEnabled(3)}
          />

          <StepAudience
            defaultValue={audience}
            onNext={(a) => {
              if (!isStepEnabled(4) || audience) return;
              setAudience(a);
              next();
            }}
            disabled={!isStepEnabled(4)}
          />

          <StepTone
            value={tone}
            onSelect={(t) => {
              if (!isStepEnabled(5) || tone) return;
              setTone(t);
              next();
            }}
            disabled={!isStepEnabled(5)}
          />

          <StepFormat
            value={format}
            onSelect={(f) => {
              if (!isStepEnabled(6) || format) return;
              setFormat(f);
              next();
            }}
            disabled={!isStepEnabled(6)}
          />
        </div>
      </div>
    </AppPageShell>
  );
}