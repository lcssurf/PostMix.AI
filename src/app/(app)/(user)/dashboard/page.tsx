"use client";

import { AppPageShell } from "@/app/(app)/_components/page-shell";
import { dashboardPageConfig } from "@/app/(app)/(user)/dashboard/_constants/page-config";
import { useEffect, useRef, useState } from "react";
import { useMultiStep } from "@/components/Stepper/useMultiStep";
import { VerticalStepIndicator } from "@/components/Stepper/VerticalStepIndicator";
import { StepProfileInput } from "@/components/Stepper/StepProfileInput";
import { StepPostSelection } from "@/components/Stepper/StepPostSelection";
import { StepGoal } from "@/components/Stepper/StepGoal";
import { StepNiche } from "@/components/Stepper/StepNiche";
import { StepAudience } from "@/components/Stepper/StepAudience";
import { StepTone } from "@/components/Stepper/StepTone";
import { StepFormat } from "@/components/Stepper/StepFormat";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {

  const [loadingStates, setLoadingStates] = useState({
    isLoadingProfile: false,
    isLoadingPosts: false,
    isLoadingGoal: false,
    isLoadingNiche: false,
    isLoadingAudience: false,
    isLoadingTone: false,
    isLoadingFormat: false,
    isGenerating: false,
  });

  const setLoadingState = (key: keyof typeof loadingStates, value: boolean) => {
    setLoadingStates((prev) => ({ ...prev, [key]: value }));
  };

  const [completedStates, setCompletedStates] = useState({
    profile: false,
    posts: false,
    goal: false,
    niche: false,
    audience: false,
    tone: false,
    format: false,
  });
  const setCompletedState = (key: keyof typeof completedStates, value: boolean) => {
    setCompletedStates((prev) => ({ ...prev, [key]: value }));
  };

  const nextIfValid = (key: keyof typeof completedStates, callback: () => void) => {
    if (!isStepEnabled(stepIndex) || completedStates[key]) return;
    callback();
    setCompletedState(key, true);
    next();
  };



  const { stepIndex, steps, next, isStepEnabled } = useMultiStep();

  const [referenceProfile, setReferenceProfile] = useState<any | null>(null);
  const [referencePosts, setReferencePosts] = useState<any[]>([]);
  const [profileError, setProfileError] = useState("");

  const [referenceUsername, setReferenceUsername] = useState("");
  const [selectedPosts, setSelectedPosts] = useState<any[]>([]);
  const [goal, setGoal] = useState("");
  const [niche, setNiche] = useState("");
  const [audience, setAudience] = useState("");
  const [tone, setTone] = useState("");
  const [format, setFormat] = useState("");


  const fetchReferenceProfile = async (username: string) => {
    setLoadingState('isLoadingProfile', true);

    // Reset fluxo completo
    setReferenceProfile(null);
    setReferencePosts([]);
    setSelectedPosts([]);
    setGoal("");
    setNiche("");
    setAudience("");
    setTone("");
    setFormat("");
    setProfileError("");

    const sanitized = username.replace(/^@/, "").trim();
    if (!/^[a-zA-Z0-9._]{2,30}$/.test(sanitized)) {
      setProfileError("Usuário inválido. Digite apenas o nome de usuário do Instagram.");
      setLoadingState('isLoadingProfile', false);
      return;
    }

    const cacheKey = `profile_${sanitized}`;

    try {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        const now = Date.now();
        const cacheAge = now - (parsed._cachedAt || 0);

        // Verifica se o cache ainda é válido (1 hora = 3600000ms, 30 minutos = 1800000ms)
        if (cacheAge < 3600000) { // 10000ms = 10s
          setReferenceProfile(parsed);
          setReferencePosts(parsed.posts || []);
          setReferenceUsername(sanitized);
          nextIfValid("profile", () => { });
          return;
        } else {
          console.log("🔄 Cache expirado para:", sanitized);
        }
      }
    } catch (e) {
      console.warn("⚠️ Erro ao acessar cache:", e);
    }

    try {
      const res = await fetch(`/api/instagram?username=${sanitized}`);
      const data = await res.json();

      if (data?.warning_code === "dead_page") {
        throw new Error("O perfil informado não foi encontrado. Verifique se o nome de usuário está correto.");
      }

      if (!res.ok) throw new Error(data?.error || "Erro inesperado");

      const payload = { ...data, _cachedAt: Date.now() };
      sessionStorage.setItem(cacheKey, JSON.stringify(payload));

      setReferenceProfile(data);
      setReferencePosts(data.posts || []);
      setReferenceUsername(sanitized);
      nextIfValid("profile", () => { });
    } catch (err: any) {
      setProfileError(err.message || "Erro ao buscar perfil.");
    } finally {
      setLoadingState('isLoadingProfile', false);
    }
  };

  //Scroll para o passo atual
  const stepRefs = steps.map(() => useRef<HTMLDivElement | null>(null));
  const generatedRef = useRef<HTMLDivElement | null>(null);


  useEffect(() => {
    const ref = stepRefs[stepIndex]?.current;
    if (ref) {
      const blockPosition = stepIndex === 1 ? "end" : "center"; // index 1 = StepPostSelection
      ref.scrollIntoView({ behavior: "smooth", block: blockPosition });
    }
  }, [stepIndex]);
  


  //CHAMA A API PARA GERAR O CONTEÚDO
  const [generatedContent, setGeneratedContent] = useState<any[] | null>(null);

  const handleGenerateContent = async () => {
    setLoadingState("isGenerating", true);
  
    const cleanedPosts = selectedPosts.map((post) => ({
      ...post,
      caption:
        typeof post.caption === "string" && post.caption.trim().length > 0
          ? post.caption
          : "Sem legenda",
    }));
  
    const payload = {
      referenceUsername,
      referenceProfile: {
        full_name: referenceProfile?.full_name,
        biography: referenceProfile?.biography,
        followers: referenceProfile?.followers,
        profile_url: referenceProfile?.profile_url || referenceProfile?.url,
      },
      selectedPosts: cleanedPosts.map((post) => ({
        caption: post.caption,
        likes: post.likes,
        comments: post.comments,
        datetime: post.datetime,
        url: post.url,
        image_url: typeof post.image_url === "string" ? post.image_url : undefined,
        video_url: typeof post.video_url === "string" ? post.video_url : undefined,
      })),
      goal,
      niche,
      audience,
      tone,
      format,
    };
  
    const maxAttempts = 2;
    let attempt = 0;
    let success = false;
  
    while (attempt < maxAttempts && !success) {
      attempt++;
  
      try {
        const res = await fetch("/api/generate-content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const contentType = res.headers.get("content-type") || "";
        let result: any;
  
        if (contentType.includes("application/json")) {
          result = await res.json();
        } else {
          const text = await res.text();
          throw new Error(`Resposta inesperada da API (texto): ${text}`);
        }
  
        if (!res.ok) {
          throw new Error(result?.error || "Erro ao gerar conteúdo");
        }
  
        setGeneratedContent(result.content);
        setTimeout(() => {
          generatedRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
        console.log("✅ Conteúdo gerado:", result);
        success = true;
      } catch (err: any) {
        console.error(`❌ Erro ao gerar conteúdo (tentativa ${attempt}):`, err);
  
        if (attempt >= maxAttempts) {
          alert(
            "Erro ao gerar conteúdo. O servidor pode estar sobrecarregado ou indisponível. Tente novamente em instantes."
          );
        } else {
          // Aguarda antes de tentar novamente (ex: 1s, 2s...)
          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
        }
      } finally {
        if (success || attempt >= maxAttempts) {
          setLoadingState("isGenerating", false);
        }
      }
    }
  };
  



  return (
    <AppPageShell title={dashboardPageConfig.title} description={dashboardPageConfig.description}>
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <VerticalStepIndicator steps={steps} currentIndex={stepIndex} />

        <div className="flex-1 space-y-6">

          <div ref={stepRefs[0]}>
            <StepProfileInput
              onSubmit={({ competitor }) => {

                if (!isStepEnabled(0) || referenceUsername) return;
                fetchReferenceProfile(competitor);

              }}
              error={profileError}
              loading={loadingStates.isLoadingProfile}
              completed={completedStates.profile}
              disabled={!isStepEnabled(0)}
            />
          </div>

          <div ref={stepRefs[1]}>
            <StepPostSelection
              profile={referenceProfile}
              completed={completedStates.posts}
              loading={loadingStates.isLoadingPosts}
              posts={referencePosts}
              onNext={(posts) => {

                nextIfValid("posts", () => setSelectedPosts(posts));
              }}
              disabled={!isStepEnabled(1)}
            />
          </div>

          <div ref={stepRefs[2]}>
            <StepGoal
              value={goal}
              onSelect={(g) => nextIfValid("goal", () => setGoal(g))}

              disabled={!isStepEnabled(2)}
              loading={loadingStates.isLoadingGoal}
              completed={completedStates.goal}
            />
          </div>

          <div ref={stepRefs[3]}>
            <StepNiche
              defaultValue={niche}
              onNext={(n) => {
                nextIfValid("niche", () => setNiche(n));
              }}
              disabled={!isStepEnabled(3)}
              loading={loadingStates.isLoadingNiche}
              completed={completedStates.niche}
            />
          </div>

          <div ref={stepRefs[4]}>
            <StepAudience
              defaultValue={audience}
              onNext={(a) => {
                nextIfValid("audience", () => setAudience(a));
              }}
              disabled={!isStepEnabled(4)}
              loading={loadingStates.isLoadingAudience}
              completed={completedStates.audience}
            />
          </div>

          <div ref={stepRefs[5]}>
            <StepTone
              value={tone}
              onSelect={(t) => {
                nextIfValid("tone", () => setTone(t));
              }}
              disabled={!isStepEnabled(5)}
              loading={loadingStates.isLoadingTone}
              completed={completedStates.tone}
            />
          </div>

          <div ref={stepRefs[6]}>
            <StepFormat
              value={format}
              onSelect={(f) => {
                nextIfValid("format", () => {
                  setFormat(f);

                  // 🔽 Log dos dados finais preenchidos
                  console.log("🧠 Dados finalizados para geração:");
                  console.log({
                    referenceUsername,
                    referenceProfile,
                    selectedPosts,
                    goal,
                    niche,
                    audience,
                    tone,
                    format: f,
                  });
                });
              }}

              disabled={!isStepEnabled(6)}
              loading={loadingStates.isLoadingFormat}
              completed={completedStates.format}
            />
          </div>
          <Button id="generate-button" onClick={handleGenerateContent} className="hidden" />

          {/* Se todos os passos estiverem completos, exibe o botão de gerar conteúdo */}
          {/* {Object.entries(completedStates).every(([key, value]) => key !== "isGenerating" && value) && (
            <div className="mt-10 p-6 rounded-xl border bg-muted" id="generate-section">
              <h2 className="text-xl font-semibold mb-2">Tudo pronto!</h2>
              <p className="mb-4">Clique no botão abaixo para gerar seus conteúdos personalizados com base nas escolhas feitas.</p>

              <button
                className="btn btn-primary"
                onClick={handleGenerateContent}
                disabled={loadingStates.isGenerating}
              >
                {loadingStates.isGenerating ? "Gerando..." : "Gerar Conteúdos"}
              </button>
            </div>
          )} */}

          {generatedContent && (
            <div ref={generatedRef} className="mt-8 space-y-4">
              <h3 className="text-lg font-medium">Conteúdos Gerados:</h3>
              {generatedContent.map((item, index) => (
                <div key={index} className="p-4 border rounded-md bg-white dark:bg-neutral-900 shadow-sm">
                  <p className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 leading-relaxed">
                    {item.caption}
                  </p>
                  {item.referencePostUrl && (
                    <a
                      href={item.referencePostUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 text-sm underline mt-2 inline-block"
                    >
                      Ver post original
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}



        </div>
      </div>
    </AppPageShell>
  );
}