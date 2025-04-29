// StepProfileInput.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const schema = z.object({
  competitor: z.string().min(2),
});

type FormData = z.infer<typeof schema>;

type Props = {
  onSubmit: (data: FormData) => void;
  disabled?: boolean;
  loading?: boolean;
  error?: string;
  completed?: boolean; // Prop to indicate if this step is already completed
};

export function StepProfileInput({ onSubmit, disabled, loading, error, completed }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <Card
      className={cn(
        disabled &&
        "opacity-50 pointer-events-none select-none blur-sm grayscale overflow-hidden"
      )}
    >
      <CardHeader>
        <CardTitle>📌 Perfil de referência</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="@perfil_concorrente"
          {...register("competitor")}
          readOnly={disabled}
          disabled={disabled}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button className="w-full" onClick={handleSubmit(onSubmit)} disabled={disabled || loading || completed}>
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Carregando...
            </div>
          ) : completed ? (
            "Concluído"
          ) : (
            "Buscar posts"
          )}
        </Button>

        <p className="text-sm text-muted-foreground">
          ⏳ Este processo leva em média <strong>3 minutos</strong>, dependendo da quantidade de posts.
        </p>

      </CardContent>
    </Card>
  );
}
