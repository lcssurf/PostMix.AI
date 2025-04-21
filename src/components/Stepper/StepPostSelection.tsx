import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post, PostCard } from "./PostCard";
import { useState } from "react";

type Props = {
  posts: Post[];
  onNext: (selected: Post[]) => void;
};

export function StepPostSelection({ posts, onNext }: Props) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecione os posts para análise</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            selected={selected.includes(post.id)}
            toggleSelect={() => toggle(post.id)}
          />
        ))}
        <div className="col-span-full">
          <Button onClick={() => onNext(posts.filter((p) => selected.includes(p.id)))} disabled={selected.length === 0}>
            Analisar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}