import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AnalysisResult = {
  style: string;
  hashtags: string[];
  frequency: string;
};

type Props = {
  data: AnalysisResult;
  onGenerate: () => void;
  disabled?: boolean;
};

export function StepAnalysisResult({ data, onGenerate, disabled }: Props) {
  return (
    <Card className={cn(disabled && "opacity-50 pointer-events-none select-none")}>
      <CardHeader>
        <CardTitle>Resultado da Análise</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          <strong>Estilo predominante:</strong> {data.style}
        </p>
        <p>
          <strong>Hashtags mais comuns:</strong> {data.hashtags.join(", ")}
        </p>
        <p>
          <strong>Frequência de postagem:</strong> {data.frequency}
        </p>
        {!disabled && (
          <Button onClick={onGenerate}>Gerar conteúdo com IA</Button>
        )}
      </CardContent>
    </Card>
  );
}
