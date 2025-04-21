"use client";

import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { dashboardPageConfig } from "@/app/(app)/(user)/dashboard/_constants/page-config";
import {
  ActivityIcon,
  CreditCardIcon,
  DollarSignIcon,
  Users2Icon,
} from "lucide-react";

import { useMultiStep } from "@/components/Stepper/useMultiStep";
import { StepProfileInput } from "@/components/Stepper/StepProfileInput";
import { StepPostSelection } from "@/components/Stepper/StepPostSelection";
import { StepAnalysisResult } from "@/components/Stepper/StepAnalysisResult";
import { useState } from "react";
import { Post } from "@/components/Stepper/PostCard";
import { VerticalStepIndicator } from "@/components/Stepper/VerticalStepIndicator";

export default function DashboardPage() {
  const { stepIndex, next, isStepEnabled } = useMultiStep();

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

  return (
    <AppPageShell
      title={dashboardPageConfig.title}
      description={dashboardPageConfig.description}
    >
        {/* KPIs */}
        {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <KpiCard title="Total Revenue" value="$45,231.89" icon={<DollarSignIcon className="h-4 w-4 text-muted-foreground" />} />
          <KpiCard title="Subscriptions" value="+3402" icon={<Users2Icon className="h-4 w-4 text-muted-foreground" />} />
          <KpiCard title="Active Now" value="+304" icon={<ActivityIcon className="h-4 w-4 text-muted-foreground" />} />
          <KpiCard title="Sales" value="+102304" icon={<CreditCardIcon className="h-4 w-4 text-muted-foreground" />} />
        </div> */}

        {/* Flow */}
        <div className="flex flex-col md:flex-row gap-8 mt-6">
          {/* Stepper lateral */}
          <VerticalStepIndicator steps={["profiles", "posts", "analysis"]} currentIndex={stepIndex} />

          {/* Conteúdo dos passos */}
          <div className="flex-1 space-y-4">
            <StepProfileInput
              onSubmit={(data) => {
                setProfileData(data);
                next();
              }}
              disabled={!isStepEnabled(0)}
            />

            <StepPostSelection
              posts={mockPosts}
              onNext={(selected) => {
                setSelectedPosts(selected);
                next();
              }}
              disabled={!isStepEnabled(1)}
            />

            <StepAnalysisResult
              data={mockAnalysis}
              onGenerate={() => {
                console.log("Gerar conteúdo com base nos dados");
              }}
              disabled={!isStepEnabled(2)}
            />
          </div>
        </div>

    </AppPageShell>
  );
}

function KpiCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border p-4 shadow-sm">
      <div className="flex items-center justify-between pb-2">
        <p className="text-sm font-medium">{title}</p>
        {icon}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">+20.1% from last month</p>
    </div>
  );
}
