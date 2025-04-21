import { cn } from "@/lib/utils";

export type Post = {
  id: number;
  text: string;
};

type PostCardProps = {
  post: Post;
  selected: boolean;
  toggleSelect: () => void;
  disabled?: boolean;
};

export function PostCard({ post, selected, toggleSelect, disabled }: PostCardProps) {
  return (
    <div
      onClick={!disabled ? toggleSelect : undefined}
      className={cn(
        "border p-4 rounded-lg transition",
        selected ? "border-primary bg-primary/10" : "border-border",
        disabled ? "opacity-50 cursor-default pointer-events-none select-none" : "cursor-pointer"
      )}
    >
      <p className="text-sm font-medium">{post.text}</p>
      <p className="text-xs text-muted-foreground">ID: {post.id}</p>
    </div>
  );
}
