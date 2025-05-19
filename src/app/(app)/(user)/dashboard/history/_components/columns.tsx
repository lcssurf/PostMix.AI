// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Copy } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { DataTableHistoryData } from "@/types/data-table";

export function getColumns(): ColumnDef<DataTableHistoryData>[] {
    return columns;
}

export const columns: ColumnDef<DataTableHistoryData>[] = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
            <Button
                variant="ghost"
                className="p-0 text-left font-mono text-xs hover:text-primary"
                onClick={() => {
                    navigator.clipboard.writeText(row.original.id);
                    toast.success("ID copiado!");
                }}
            >
                {row.original.id}
                <Copy className="ml-2 h-4 w-4 inline" />
            </Button>
        ),
    },
    {
        accessorKey: "createdAt",
        header: "Data",
        cell: ({ row }) => {
            const raw = row.original.createdAt;

            if (!raw || typeof raw !== "string") return "—";

            try {
                const cleaned = raw.split(".")[0]; // remove fração
                const date = new Date(cleaned + "Z"); // UTC
                if (isNaN(date.getTime())) return "—";
                return format(date, "dd/MM/yyyy HH:mm");
            } catch {
                return "—";
            }
        },
    },
    {
        accessorKey: "format",
        header: "Formato",
        cell: ({ row }) => (
            <Badge variant="outline" className="capitalize">
                {row.original.contentType}
            </Badge>
        ),
    },
    {
  id: "content",
  header: "Conteúdo",
  cell: ({ row }) => {
    const content = row.original.content;

    let parsed: { title?: string; text?: string[] } = {};
    try {
      parsed = typeof content === "string" ? JSON.parse(content) : content;
    } catch {
      parsed = { title: "Erro ao carregar", text: [String(content)] };
    }

    return (
    <Accordion type="single" collapsible className="w-full">
  <AccordionItem value={`item-${row.original.id}`}>
    <AccordionTrigger className="text-sm">Ver conteúdo</AccordionTrigger>
    <AccordionContent className="rounded-md bg-muted p-4 text-sm text-muted-foreground">
      <div className="max-h-[400px] overflow-y-auto pr-2">
        {parsed.title && (
          <p className="font-bold text-white mb-2">{parsed.title}</p>
        )}
        {Array.isArray(parsed.text) && parsed.text.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {parsed.text.map((line, i) => (
              <li key={i} className="break-words">{line}</li>
            ))}
          </ul>
        ) : (
          <div className="overflow-x-auto">
            <pre className="whitespace-pre text-xs break-words">
              {JSON.stringify(content, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </AccordionContent>
  </AccordionItem>
</Accordion>

    );
  },
},

];
