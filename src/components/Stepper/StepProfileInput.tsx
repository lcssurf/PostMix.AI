// StepProfileInput.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";

const schema = z.object({
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
        {!disabled && (
          <Button onClick={handleSubmit(onSubmit)}>Buscar posts</Button>
        )}
      </CardContent>
    </Card>
  );
}
