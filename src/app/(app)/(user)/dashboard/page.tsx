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
import { StepSpecificSubject } from "@/components/Stepper/StepSpecificSubject";


export default function DashboardPage() {
  const [connected, setConnected] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const checkCanvaConnection = async () => {
  //     try {
  //       console.log("🚀 Verificando conexão com o Canva...");
  //       const res = await fetch("/api/canva/status");
  //       const data = await res.json();
  //       setConnected(data.status === 'connected' ? true : false);
  //       console.log("🔗 Status do Canva:", data.status === 'connected' ? "Conectado" : "Desconectado");
  //     } catch (error) {
  //       console.error("❌ Erro ao verificar conexão com o Canva:", error);
  //       setConnected(null);
  //     }
  //   };

  //   checkCanvaConnection();
  // }, []);



  useEffect(() => {
    const stored = sessionStorage.getItem("login-logged");

    const expired =
      stored && Date.now() - Number(stored) > 12 * 60 * 60 * 1000; // 12 hours

    if (!stored || expired) {
      fetch("/api/log-login", { method: "POST" })
        .then((res) => {
          if (res.ok) {
            sessionStorage.setItem("login-logged", Date.now().toString());
          }
        })
        .catch((err) => {
          console.error("Failed to log login:", err);
        });
    }
  }, []);


  const [loadingStates, setLoadingStates] = useState({
    isLoadingProfile: false,
    isLoadingPosts: false,
    isLoadingGoal: false,
    isLoadingNiche: false,
    isLoadingAudience: false,
    isLoadingTone: false,
    isLoadingFormat: false,
    isGenerating: false,
    isLoadingSpecificSubject: false,
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
    specificSubject: false,
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
  const [tone, setTone] = useState<string[]>([]);
  const [format, setFormat] = useState("");
  const [specificSubject, setSpecificSubject] = useState("");



  const [transcriptions, setTranscriptions] = useState<Record<string, string[]>>({});
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [progressInfo, setProgressInfo] = useState({ completed: 0, total: 0 });
  const [failedPosts, setFailedPosts] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const [showGenerationSuccess, setShowGenerationSuccess] = useState(false);
  const [showGeneratingToast, setShowGeneratingToast] = useState(false);



  const estimatedSeconds = Math.ceil((progressInfo.total - progressInfo.completed) * 2);
  const estimatedMinutes = Math.floor(estimatedSeconds / 60);
  const estimatedRemaining = estimatedMinutes > 0
    ? `${estimatedMinutes} min`
    : `${estimatedSeconds} seg`;






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
    setTone([""]);
    setFormat("");
    setProfileError("");
    setSpecificSubject("");

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
        throw new Error("Não conseguimos carregar os posts no momento. O perfil pode ser privado ou ocorreu um problema temporário.");
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

      localStorage.setItem(cacheKey, JSON.stringify(payload));

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
      const blockPosition = stepIndex === 1 ? "start" : "center"; // index 1 = StepPostSelection or generatedRef
      ref.scrollIntoView({ behavior: "smooth", block: blockPosition });
    }
  }, [stepIndex]);

  const generateButtonRef = useRef<HTMLButtonElement | null>(null);




  //CHAMA A API PARA GERAR O CONTEÚDO
  const [generatedContent, setGeneratedContent] = useState<any[] | null>(null);

  const handleGenerateContent = async () => {
    setLoadingState("isGenerating", true);
    setShowGeneratingToast(true); // Mostra o Toast de carregamento


    const cleanedPosts = selectedPosts.map((post) => ({
      ...post,
      caption:
        typeof post.caption === "string" && post.caption.trim().length > 0
          ? post.caption
          : "Sem legenda",
    }));

    const payload = removeEmptyFields({
      referenceUsername,
      referenceProfile: removeEmptyFields({
        full_name: referenceProfile?.full_name,
        biography: referenceProfile?.biography,
        followers: referenceProfile?.followers,
        profile_url: referenceProfile?.profile_url || referenceProfile?.url,
      }),
      selectedPosts: cleanedPosts.map((post) => removeEmptyFields({
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
      specificSubject,
    });


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
          generatedRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        setShowGeneratingToast(false); // Esconde o Toast de carregamento
        if (success || attempt >= maxAttempts) {
          setLoadingState("isGenerating", false);

          if (success) {
            setShowGenerationSuccess(true); // 🆕 Mostra o Toast de sucesso
          }
        }
      }
    }
  };

  const BATCH_SIZE = 3; // controla quantas transcrições simultâneas

  const startTranscription = async (posts: any[]) => {
    setProgressInfo({ completed: 0, total: posts.length });
    setOpen(true);
    setIsTranscribing(true);
    setFailedPosts([]);

    const transcriptionResults: Record<string, string[]> = {};
    const failed: string[] = [];

    const MAX_ATTEMPTS = 3;
    const DELAY_BETWEEN_ATTEMPTS = 1000;

    const normalizePostMedia = (post: any) => {
      const images: string[] = [];
      let video: string | undefined = undefined;

      if (post?.post_content?.length > 0) {
        const videoItem = post.post_content.find((content: any) => content.type === "Video");
        if (videoItem) {
          video = videoItem.url;
        }
      }

      if (post?.images?.length > 0) {
        for (const img of post.images) {
          images.push(img.url);
        }
      } else if (post?.photos?.length > 0) {
        for (const photo of post.photos) {
          images.push(photo);
        }
      }

      return { images, video };
    };

    const fetchTranscription = async (image_url?: string, video_url?: string) => {
      let attempt = 0;

      if (!image_url && !video_url) {
        return null;
      }

      while (attempt < MAX_ATTEMPTS) {
        attempt++;
        try {
          const res = await fetch("/api/transcribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image_url,
              video_url,
            }),
          });

          if (res.status === 413) {
            console.warn(`Arquivo muito grande para transcrição`);
            return "Arquivo muito grande para transcrição.";
          }

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
          console.error(`Erro ao transcrever (tentativa ${attempt}):`, error);

          if (attempt < MAX_ATTEMPTS) {
            await new Promise((resolve) => setTimeout(resolve, DELAY_BETWEEN_ATTEMPTS));
          }
        }
      }

      return null;
    };

    let completed = 0;
    const tasks: Promise<void>[] = [];

    for (const post of posts) {
      tasks.push((async () => {
        const { images, video } = normalizePostMedia(post);
        const postTranscriptions: string[] = [];

        if (video) {
          const transcription = await fetchTranscription(undefined, video);
          if (transcription && transcription !== "Arquivo muito grande para transcrição.") {
            postTranscriptions.push(transcription);
          } else {
            failed.push(post.url);
          }
        } else if (images.length > 0) {
          for (const imageUrl of images) {
            const transcription = await fetchTranscription(imageUrl, undefined);
            if (transcription && transcription !== "Arquivo muito grande para transcrição.") {
              postTranscriptions.push(transcription);
            } else {
              console.warn(`Imagem falhou: ${imageUrl}`);
              // Não marca o post inteiro imediatamente
            }
          }
        } else {
          console.warn(`Post sem mídia utilizável: ${post.url}`);
          failed.push(post.url);
        }

        if (postTranscriptions.length > 0) {
          transcriptionResults[post.url] = postTranscriptions;
        } else {
          failed.push(post.url);
        }

        completed++;
        setProgressInfo({ completed, total: posts.length });
      })());

      // Se chegamos no tamanho de batch, aguardamos
      if (tasks.length >= BATCH_SIZE) {
        await Promise.all(tasks.splice(0, BATCH_SIZE));
      }
    }

    // Aguarda tasks restantes
    await Promise.all(tasks);

    setTranscriptions(transcriptionResults);
    setFailedPosts(failed);
    setIsTranscribing(false);
    setOpen(false);
  };

  function removeEmptyFields(obj: any): any {
    return Object.entries(obj)
      .filter(([_, v]) => v !== undefined && v !== null && v !== "")
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  }

const stepKeyToLabel: Record<keyof typeof completedStates, string> = {
  profile: "Perfil de referência",
  posts: "Seleção de posts",
  goal: "Objetivo",
  niche: "Nicho",
  audience: "Público-alvo",
  tone: "Tom de voz",
  format: "Formato",
  specificSubject: "Assunto Específico",
};

const skipStep = (key: keyof typeof completedStates) => {
  const label = stepKeyToLabel[key];
  const idx = steps.findIndex((step) => step === label);
  // if (!isStepEnabled(idx)) {
  //   console.warn(`🚫 Step ${key} não está habilitado para pular.`);
  //   return;
  // }

  setCompletedState(key, true);
  next();
};




  return (
    <AppPageShell title={dashboardPageConfig.title} description={dashboardPageConfig.description}>

      <div className="flex flex-col md:flex-row gap-8 mt-6">



        {/* Barra lateral com sticky */}
        <div className="relative">
          <div className="sticky top-20">
            <VerticalStepIndicator steps={steps} currentIndex={stepIndex} />
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 space-y-6">

          <div ref={stepRefs[0]}>

            {/* <div className="flex justify-end pb-2">
              {connected === null ? (
                <Button disabled>
                  <img

                    src="/CanvaLogo.svg"
                    alt="Canva Logo"
                    className="w-6 h-6 mr-2"
                  />
                  Verificando conexão...
                </Button>
              ) : connected ? (
                <div className="flex items-center gap-2">

                  <Button
                    disabled
                  >
                    <img

                      src="/CanvaLogo.svg"
                      alt="Canva Logo"
                      className="w-6 h-6 mr-2"
                    />
                    Você está conectado ao Canva
                  </Button>
                </div>
              ) : (
                <a href="/api/canva/authorize" target="_blank" rel="noopener noreferrer">
                  <div className="flex items-center gap-2">

                    <Button>
                      <img
                        src="/CanvaLogo.svg"
                        alt="Canva Logo"
                        className="w-6 h-6 mr-2"
                      />
                      Conectar ao Canva
                    </Button>
                  </div>
                </a>
              )}
            </div> */}

            <StepProfileInput
            skipStep={() => {
              skipStep("profile")
              skipStep("posts");
            }}
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
            <StepSpecificSubject
              defaultValue={specificSubject}
              onNext={(subject) => nextIfValid("specificSubject", () => setSpecificSubject(subject))}
              disabled={!isStepEnabled(5)}
              loading={loadingStates.isLoadingSpecificSubject}
              completed={completedStates.specificSubject}
            />
          </div>


          <div ref={stepRefs[6]}>
            <StepTone
              value={tone}
              onSelect={(t) => {
                nextIfValid("tone", () => setTone(t));
              }}
              disabled={!isStepEnabled(6)}
              loading={loadingStates.isLoadingTone}
              completed={completedStates.tone}
            />
          </div>

          <div ref={stepRefs[7]}>
            <StepFormat
              value={format}
              onSelect={(f) => {
                nextIfValid("format", () => {
                  setFormat(f);
                  setTimeout(() => {
                    generateButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }, 300);


                  // 🔽 Log dos dados finais preenchidos
                  // console.log("🧠 Dados finalizados para geração:");
                  // console.log({
                  //   referenceUsername,
                  //   referenceProfile,
                  //   selectedPosts,
                  //   goal,
                  //   niche,
                  //   audience,
                  //   tone,
                  //   format: f,
                  // });
                });
              }}

              disabled={!isStepEnabled(7)}
              loading={loadingStates.isLoadingFormat || isTranscribing}
              completed={completedStates.format}
            />
          </div>
          {/* {isTranscribing && (
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
          )} */}

          {/* Botão oculto para gerar conteúdo */}
          <Button ref={generateButtonRef} id="generate-button" onClick={handleGenerateContent} className="hidden" />

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
            <div ref={generatedRef} className="mt-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Conteúdos Gerados:</h3>
                <div className="flex gap-2">

                  {/* {connected === null ? (
                    <Button disabled>

                      <img

                        src="/CanvaLogo.svg"
                        alt="Canva Logo"
                        className="w-6 h-6"
                      />
                      Verificando conexão...
                    </Button>
                  ) : connected ? (
                    <Button
                      onClick={async () => {
                        const res = await fetch("/api/canva/generate", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ conteudo: generatedContent }),
                        });
                        const data = await res.json();
                        window.open(data.url, "_blank");
                      }}
                    >
                      <img

                        src="/CanvaLogo.svg"
                        alt="Canva Logo"
                        className="w-6 h-6 mr-2"
                      />
                      Gerar no Canva
                    </Button>
                  ) : (
                    <a href="/api/canva/authorize" target="_blank" rel="noopener noreferrer">
                      <Button>
                        <img

                          src="/CanvaLogo.svg"
                          alt="Canva Logo"
                          className="w-6 h-6"
                        />
                        Conectar ao Canva
                      </Button>
                    </a>
                  )} */}


                  <Button
                    variant="outline"
                    size="default"
                    onClick={handleGenerateContent}
                    disabled={loadingStates.isGenerating}
                  >
                    {loadingStates.isGenerating ? "Gerando..." : "🔄 Gerar Novamente"}
                  </Button>


                  <Button
                    variant="destructive"
                    size="default"
                    onClick={() => {
                      if (confirm("Tem certeza que deseja reiniciar? Você perderá todo o progresso atual.")) {
                        window.location.reload();
                      }
                    }}
                  >
                    🧹 Reiniciar
                  </Button>
                </div>
              </div>

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
      <Toast.Provider swipeDirection="right" duration={Infinity}>
        {/* Toast de transcrição ou falha */}
        {open && (
          <Toast.Root
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
                  {progressInfo.completed}/{progressInfo.total} concluídos<br />
                  Estimativa restante: {estimatedRemaining}
                </Toast.Description>
                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${(progressInfo.completed / progressInfo.total) * 100}%` }}
                  />
                </div>
              </>
            )}

            {!isTranscribing && failedPosts.length > 0 && (
              <>
                <p className="text-sm text-red-600 mt-2">Falhou em:</p>
                <ul className="list-disc pl-5 text-sm">
                  {failedPosts.map((postUrl, index) => (
                    <li key={index}>
                      <a
                        href={postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        {postUrl}
                      </a>
                    </li>
                  ))}
                </ul>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => {
                    setOpen(false);
                    startTranscription(referencePosts.filter((p) => failedPosts.includes(p.url)));
                  }}
                >
                  Tentar novamente
                </Button>
              </>
            )}
          </Toast.Root>
        )}

        {showGeneratingToast && (
          <Toast.Root
            onOpenChange={setShowGeneratingToast}
            duration={Infinity}
            className="bg-blue-100 border border-blue-300 dark:bg-blue-900 dark:border-blue-700 shadow-lg rounded-lg p-4 w-80 z-[999]"
          >
            <Toast.Title className="font-semibold text-blue-700 dark:text-blue-300 flex items-center gap-2">
              <span className="animate-[spin_2s_linear_infinite]">⏳</span>Gerando conteúdo...
            </Toast.Title>
            <Toast.Description className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              Estamos criando seu post personalizado. Isso pode levar alguns minutos 🚀
            </Toast.Description>
          </Toast.Root>
        )}

        {/* Toast de sucesso na geração */}
        {showGenerationSuccess && (
          <Toast.Root
            onOpenChange={setShowGenerationSuccess}
            duration={4000}
            className="bg-green-100 border border-green-300 dark:bg-green-900 dark:border-green-700 shadow-lg rounded-lg p-4 w-80 z-[999]"
          >
            <Toast.Title className="font-semibold text-green-700 dark:text-green-300">
              ✅ Conteúdo gerado com sucesso!
            </Toast.Title>
            <Toast.Description className="text-sm text-green-600 dark:text-green-400 mt-1">
              Seu post está pronto para ser usado 🚀
            </Toast.Description>
          </Toast.Root>
        )}

        <Toast.Viewport className="fixed bottom-6 md:right-6 flex flex-col gap-2 w-96 max-w-screen-sm z-[999]" />
      </Toast.Provider>


    </AppPageShell>
  );
}