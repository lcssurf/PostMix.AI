"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { siteUrls } from "@/config/urls";
import { Icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SocialLogins } from "@/app/auth/_components/social-logins";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const formSchema = z.object({
    email: z.string().email("Por favor, insira um endereço de e-mail válido"),
});

type formSchemaType = z.infer<typeof formSchema>;

type AuthFormProps = {
    type: "signup" | "login";
};

export function AuthForm({ type }: AuthFormProps) {
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data: formSchemaType) => {
        setIsLoading(true);

        try {
            await signIn("email", {
                email: data.email,
                callbackUrl: siteUrls.dashboard.home,
                redirect: false,
            });
            toast.success("Confira seu e-mail para acessar o link mágico.", {
                description: "Não se esqueça de verificar a pasta de spam caso não o encontre.",
            });
        } catch (error) {
            toast.error("Ocorreu um erro. Por favor, tente novamente mais tarde.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="bg w-full max-w-sm space-y-6"
            >
                <div className="flex flex-col items-center space-y-4">
                    <Link
                        href={siteUrls.home}
                        className="flex w-fit items-center transition-transform hover:scale-90"
                    >
                        <Icons.logoIcon className="h-10 w-10 fill-primary" />
                    </Link>
                    <div className="flex flex-col items-center space-y-1">
                        <h1 className="text-center text-2xl font-medium">
                            {type === "signup"
                                ? "Crie uma conta"
                                : "Faça login na sua conta"}
                        </h1>
                        <Link
                            href={
                                type === "signup"
                                    ? siteUrls.auth.login
                                    : siteUrls.auth.signup
                            }
                            className="text-center text-sm text-muted-foreground underline underline-offset-4"
                        >
                            {type === "signup"
                                ? "Já tem uma conta? Faça login"
                                : "Não tem uma conta? Cadastre-se"}
                        </Link>
                    </div>
                </div>

                <div className="space-y-3">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-background"
                                        placeholder="seuemail@exemplo.com"
                                        {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Nunca compartilharemos seu e-mail com
                                    ninguém.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        disabled={isLoading}
                        aria-disabled={isLoading}
                        type="submit"
                        className="w-full gap-2"
                    >
                        {isLoading && <Icons.loader className="h-4 w-4" />}
                        <span>Continuar com Email</span>
                    </Button>
                </div>

                {/* <div className="relative flex items-center justify-center">
                    <Separator className="w-full" />
                    <p className="absolute bg-background px-2 text-sm font-medium text-muted-foreground">
                        OR
                    </p>
                </div>

                <SocialLogins /> */}
            </form>
        </Form>
    );
}
