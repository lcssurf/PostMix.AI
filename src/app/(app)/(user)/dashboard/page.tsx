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

import * as Toast from "@radix-ui/react-toast";


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

  const [transcriptions, setTranscriptions] = useState<Record<string, string>>({});
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progressInfo, setProgressInfo] = useState({ completed: 0, total: 0 });
  const [failedPosts, setFailedPosts] = useState<string[]>([]);
  const [open, setOpen] = useState(false);





  useEffect(() => {
    console.log("📌 Reference Username:", referenceUsername);
    console.log("📌 Reference Profile:", referenceProfile);
    console.log("📌 Selected Posts:", selectedPosts);
  }, [referenceUsername, referenceProfile, referencePosts]);


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

        if (cacheAge < 24 * 60 * 60 * 1000) { // Cache válido por 24 horas 
          setReferenceProfile(parsed.profile);
          setReferencePosts(parsed.posts);
          setReferenceUsername(sanitized);
          nextIfValid("profile", () => { });
          console.log("🔄 Cache encontrado e válido para:", sanitized);
          setLoadingState('isLoadingProfile', false);
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

      const posts = await res.json();

      console.log("📸 Dados do Instagram:", posts);
      // return


      if (!Array.isArray(posts)) {
        throw new Error("Erro ao buscar posts do perfil.");
      }

      if (posts.length === 0) {
        throw new Error("Não foram encontrados posts nesse perfil.");
      }

      if (posts[0]?.warning_code === "dead_page") {
        throw new Error("O perfil informado não foi encontrado. Verifique se o nome de usuário está correto.");
      }

      const profile = {
        username: posts[0]?.user_posted || sanitized,
        followers: posts[0]?.followers || null,
        profile_image_link: posts[0]?.profile_image_link || null,
        profile_url: posts[0]?.profile_url || `https://www.instagram.com/${sanitized}/`,
        is_verified: posts[0]?.is_verified || false,
        posts_count: posts[0]?.posts_count || posts.length,
      };

      const payload = {
        profile,
        posts,
        _cachedAt: Date.now(),
      };

      sessionStorage.setItem(cacheKey, JSON.stringify(payload));

      setReferenceProfile(profile);
      setReferencePosts(posts);
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
      const blockPosition = stepIndex === 1 ? "start" : "center"; // index 1 = StepPostSelection
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
        transcription: transcriptions[post.url] || null,
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

  const startTranscription = async (posts: any[]) => {
    setOpen(true);
    setIsTranscribing(true);
    setFailedPosts([]); // Resetar falhas

    const transcriptionResults: Record<string, string> = {};
    const failed: string[] = [];

    const MAX_ATTEMPTS = 3;
    const DELAY_BETWEEN_ATTEMPTS = 1000;

    const fetchTranscription = async (post: any) => {
      let attempt = 0;

      while (attempt < MAX_ATTEMPTS) {
        attempt++;
        try {
            const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCqVQzoDazrAzQjRwtnuUMBASqOZdya8eI`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
              {
                parts: [
                {
                  text: "Explain how AI works",
                },
                ],
              },
              ],
              image_url: post.image_url,
              video_url: post.video_url,
              post_url: post.url,
            }),
            });

          if (!res.ok) {
            throw new Error(`Resposta não OK: ${res.status}`);
          }

          const data = await res.json();

          if (data?.transcription) {
            return data.transcription;
          } else {
            throw new Error("Resposta sem transcrição");
          }
        } catch (error) {
          console.error(`Erro ao transcrever (tentativa ${attempt}) para ${post.url}:`, error);

          if (attempt < MAX_ATTEMPTS) {
            await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_ATTEMPTS));
          }
        }
      }

      return null;
    };

    let completed = 0;
    for (const post of posts) {
      const transcription = await fetchTranscription(post);
      if (transcription) {
        transcriptionResults[post.url] = transcription;
      } else {
        failed.push(post.url);
      }
      completed++;
      setProgressInfo({ completed, total: posts.length });
    }

    setTranscriptions(transcriptionResults);
    setFailedPosts(failed);
    setIsTranscribing(false);
    setOpen(false);
  };




  return (
    <AppPageShell title={dashboardPageConfig.title} description={dashboardPageConfig.description}>

      <div className="grid md:grid-cols-[220px_1fr] gap-8 mt-6">


        {/* Barra lateral com sticky */}
        <div className="relative">
          <div className="sticky top-20">
            <VerticalStepIndicator steps={steps} currentIndex={stepIndex} />
          </div>
        </div>

        {/* Conteúdo principal */}
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

          {referenceProfile && referencePosts.length > 0 && (
            <div ref={stepRefs[1]}>
              <StepPostSelection
                profile={referenceProfile}
                completed={completedStates.posts}
                loading={loadingStates.isLoadingPosts}
                posts={referencePosts}
                onNext={(posts) => {

                  nextIfValid("posts", () => {
                    setSelectedPosts(posts);
                    startTranscription(posts);
                  });
                }}
                disabled={!isStepEnabled(1)}
              />
            </div>
          )}

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
              loading={loadingStates.isLoadingFormat || isTranscribing}
              completed={completedStates.format}
            />
          </div>
          {isTranscribing && (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded-md">
              <span className="animate-spin">⏳</span>
              Estamos processando as transcrições dos posts selecionados...
            </div>
          )}
          {transcriptions && Object.keys(transcriptions).length > 0 && !isTranscribing && (
            <div className="p-4 bg-green-100 text-green-800 rounded-md">
              <span className="animate-pulse">🚀</span>
              Transcrições concluídas! Pronto para gerar o conteúdo. Clique no botão acima.
            </div>
          )}

          {/* Botão oculto para gerar conteúdo */}
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


      {/* Painel Flutuante de Progresso */}
      {(isTranscribing || failedPosts.length > 0) && (
       <Toast.Provider swipeDirection="right">
       <Toast.Root
         open={open && (isTranscribing || failedPosts.length > 0)}
         onOpenChange={setOpen}
         className="bg-white dark:bg-neutral-900 border shadow-lg rounded-lg p-4 w-80 z-[999]"
       >
         <Toast.Title className="font-semibold mb-1">
           {isTranscribing
             ? "Transcrevendo posts..."
             : failedPosts.length > 0
             ? `Falha em ${failedPosts.length} posts`
             : "Tudo pronto! 🚀"}
         </Toast.Title>
     
         {isTranscribing && (
           <>
             <Toast.Description className="text-sm text-muted-foreground mb-2">
               {progressInfo.completed}/{progressInfo.total} concluídos
             </Toast.Description>
             <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
               <div
                 className="bg-blue-500 h-2 rounded-full transition-all"
                 style={{ width: `${(progressInfo.completed / progressInfo.total) * 100}%` }}
               />
             </div>
           </>
         )}
     
         {!isTranscribing && failedPosts.length > 0 && (
           <Button
             variant="outline"
             size="sm"
             className="mt-2"
             onClick={() => {
               setOpen(false);
               startTranscription(referencePosts.filter((p) => failedPosts.includes(p.url)));
             }}
           >
             Tentar novamente
           </Button>
         )}
       </Toast.Root>
     
       <Toast.Viewport className="fixed bottom-6 right-6 flex flex-col gap-2 w-96 max-w-screen-sm z-[999]" />
     </Toast.Provider>
     
      )}


    </AppPageShell>
  );
}