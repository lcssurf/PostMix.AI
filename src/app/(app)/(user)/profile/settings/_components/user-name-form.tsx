"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "next-auth";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
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

const userNameFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be at most 50 characters long"),
});

export type UserNameFormSchema = z.infer<typeof userNameFormSchema>;

type UserNameFormProps = {
    user: User;
};

export function UserNameForm({ user }: UserNameFormProps) {
    const router = useRouter();

    const form = useForm<UserNameFormSchema>({
        resolver: zodResolver(userNameFormSchema),
        defaultValues: {
            name: user.name ?? "",
        },
    });

    const { isPending, mutateAsync } = useMutation({
        mutationFn: () => updateNameMutation({ name: form.getValues().name }),
        onSuccess: () => {
            router.refresh();
            toast.success("Nome atualizado com sucesso");
        },
        onError: (error: { message?: string } = {}) =>
            toast.error(
                error.message ?? "Falha ao atualizar o nome, tente novamente mais tarde",
            ),
    });

    const onSubmit = async (values: UserNameFormSchema) => {
        if (values.name === user.name) {
            return toast("O nome já está definido como este nome");
        }

        await mutateAsync();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card className="flex h-full w-full flex-col justify-between">
                    <div>
                        <CardHeader>
                            <CardTitle>Nome</CardTitle>
                            <CardDescription>
                                Por favor, insira seu nome completo ou um nome de exibição com o qual você se sinta confortável.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="alidotm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </div>
                    <CardFooter>
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="gap-2"
                        >
                            {isPending && <Icons.loader className="h-4 w-4" />}
                            <span>Salvar Alterações</span>
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}
