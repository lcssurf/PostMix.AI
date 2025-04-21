// StepProfileInput.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const schema = z.object({
  me: z.string().min(2),
  competitor: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onSubmit: (data: FormData) => void;
  disabled?: boolean;
};

export function StepProfileInput({ onSubmit, disabled }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <Card className={cn(disabled && "opacity-50 pointer-events-none select-none")}>
      <CardHeader>
        <CardTitle>Perfis para análise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="@seu_perfil"
          {...register("me")}
          readOnly={disabled}
        />
        <Input
          placeholder="@concorrente"
          {...register("competitor")}
          readOnly={disabled}
        />
        {!disabled && (
          <Button onClick={handleSubmit(onSubmit)}>Buscar posts</Button>
        )}
      </CardContent>
    </Card>
  );
}
