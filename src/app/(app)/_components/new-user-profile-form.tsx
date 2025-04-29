"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "next-auth";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/ui/icons";
import { useMutation } from "@tanstack/react-query";
import { updateNameMutation } from "@/server/actions/user/mutations";
import { useAwaitableTransition } from "@/hooks/use-awaitable-transition";
import { siteConfig } from "@/config/site";
import { new_user_setup_step_cookie } from "@/config/cookie-keys";
import { createOrgMutation } from "@/server/actions/organization/mutations";

const profileFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
});

export type ProfileFormSchema = z.infer<typeof profileFormSchema>;

type NewUserProfileFormProps = {
    user: User;
    currentStep: number;
};

export function NewUserProfileForm({
    user,
    currentStep,
}: NewUserProfileFormProps) {
    const router = useRouter();

    const form = useForm<ProfileFormSchema>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name ?? "",
        },
    });

    const { isPending: isMutatePending, mutateAsync: updateNameMutate  } = useMutation({
        mutationFn: () => updateNameMutation({ name: form.getValues().name }),
    });

    const { isPending: isMutateOrgPending, mutateAsync: createOrgMutate } = useMutation({
        mutationFn: () => createOrgMutation({
            name: `${form.getValues().name}'s Organization`,
            email: user.email ?? "placeholder@email.com",
        }),
    });
    

    const [isPending, startAwaitableTransition] = useAwaitableTransition();

    const onSubmit = async () => {
        try {
            await updateNameMutate();
            await createOrgMutate();

            await startAwaitableTransition(() => {
                document.cookie = `${new_user_setup_step_cookie}${user.id}=${currentStep + 1}; path=/`;
                router.refresh();
            });

            toast.success("Perfil configurado e organização criada com sucesso!");
        } catch (error) {
            toast.error(
                (error as { message?: string })?.message ??
                    "Ocorreu um erro ao atualizar seu perfil",
            );
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            Bem-vindo ao {siteConfig.name}
                        </CardTitle>
                        <CardDescription>
                            Por favor, configure seu perfil para começar
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite seu nome completo"
                                            {...field}
                                            aria-label="Nome Completo"
                                            autoComplete="name"
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Insira seu nome completo para começar
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input value={user?.email ?? ""} readOnly disabled/>
                            </FormControl>
                            <FormDescription>
                                Este é o email que você usou para se inscrever
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    </CardContent>

                    <CardFooter className="flex items-center justify-end gap-2">
                        <Button
                            disabled={isPending || isMutatePending || isMutateOrgPending}
                            type="submit"
                            className="gap-2"
                        >
                            {isPending || isMutatePending || isMutateOrgPending ? (
                                <Icons.loader className="h-4 w-4" />
                            ) : null}
                            <span>Continuar</span>
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
