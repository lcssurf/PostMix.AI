import { cn } from "@/lib/utils";

export type Post = {
  id: number;
  text: string;
};

type PostCardProps = {
  post: Post;
  selected: boolean;
  toggleSelect: () => void;
};

export function PostCard({ post, selected, toggleSelect }: PostCardProps) {
  return (
    <div
      onClick={toggleSelect}
      className={cn(
        "border p-4 rounded-lg cursor-pointer transition",
        selected ? "border-primary bg-primary/10" : "border-border"
      )}
    >
      <p className="text-sm font-medium">{post.text}</p>
      <p className="text-xs text-muted-foreground">ID: {post.id}</p>
    </div>
  );
}