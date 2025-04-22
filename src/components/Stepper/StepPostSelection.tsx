// StepPostSelection.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post, PostCard } from "./PostCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  posts: Post[];
  onNext: (selected: Post[]) => void;
  disabled?: boolean;
};

export function StepPostSelection({ posts, onNext, disabled }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string | number) => {
    const strId = String(id);
    setSelected((prev) =>
      prev.includes(strId) ? prev.filter((i) => i !== strId) : [...prev, strId].slice(0, 3)
    );
  };

  return (
    <Card
      className={cn(
        disabled &&
        "pointer-events-none select-none blur-sm grayscale overflow-hidden"
      )}
    >
      <CardHeader>
        <CardTitle>📸 Selecione até 3 posts para análise</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            selected={selected.includes(String(post.id))}
            toggleSelect={() => toggle(post.id)}
            disabled={disabled}
          />
        ))}
        {!disabled && (
          <div className="col-span-full">
            <Button
              onClick={() => onNext(posts.filter((p) => selected.includes(String(p.id))))}
              disabled={selected.length === 0}
            >
              Analisar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}