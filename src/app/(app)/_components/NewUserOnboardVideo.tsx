"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAwaitableTransition } from "@/hooks/use-awaitable-transition";
import { new_user_setup_step_cookie } from "@/config/cookie-keys";
import { useMutation } from "@tanstack/react-query";
import { completeNewUserSetupMutation } from "@/server/actions/user/mutations";
import { getUser } from "@/server/auth";

type NewUserOnboardVideoProps = {
    currentStep: number;
    userId: string;
};

export async function NewUserOnboardVideo({ currentStep, userId }: NewUserOnboardVideoProps) {
    const router = useRouter();
    const [isPending, startTransition] = useAwaitableTransition();

    const { mutateAsync, isPending: isCompletePending } = useMutation({
        mutationFn: () => completeNewUserSetupMutation(),
    });

    const handleContinue = async () => {
        try {
            await mutateAsync();

            await startTransition(() => {
                document.cookie = `${new_user_setup_step_cookie}${userId}=${currentStep + 1}; path=/`;
                router.refresh();
            });
        } catch (error) {
            console.error("Erro ao completar onboarding", error);
        }
    };


    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Conheça o {process.env.NEXT_PUBLIC_APP_NAME ?? "nosso sistema"}</CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col items-center gap-6">
                <img
                    className="rounded-lg w-full max-h-[400px] object-cover"
                    src="/onborading.webp"
                    alt="PostMix.AI - Conheça o nosso sistema"
                />
            </CardContent>

            <CardFooter className="flex justify-end">
                <Button 
                    onClick={handleContinue} 
                    disabled={isPending || isCompletePending}
                >
                    {isPending || isCompletePending ? "Carregando..." : "Finalizar"}
                </Button>
            </CardFooter>
        </Card>
    );
}
