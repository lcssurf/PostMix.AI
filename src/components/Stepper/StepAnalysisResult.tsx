import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AnalysisResult = {
  style: string;
  hashtags: string[];
  frequency: string;
};

type Props = {
  data: AnalysisResult;
  onGenerate: () => void;
};

export function StepAnalysisResult({ data, onGenerate }: Props) {
  return (
    <Card>
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
        <Button onClick={onGenerate}>Gerar conteúdo com IA</Button>
      </CardContent>
    </Card>
  );
}
