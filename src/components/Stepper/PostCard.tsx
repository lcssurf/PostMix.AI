import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";

export type Post = {
  id: string;
  caption?: string;
  image_url: string;
  url: string;
  video_url?: string | null;
  likes?: number;
  datetime?: string;
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
        "border rounded-lg overflow-hidden transition shadow-sm",
        selected ? "border-primary ring-2 ring-primary/40" : "border-border",
        disabled ? "opacity-50 pointer-events-none select-none" : "cursor-pointer"
      )}
    >
      <div className="relative aspect-[1/1] w-full h-auto">
        <Image
          src={post.image_url}
          alt="Post"
          fill
          className="object-cover"
        />
      </div>
      <div className="p-3 space-y-1 text-sm">
        <p className="font-medium line-clamp-2">
          {post.caption || "Sem legenda"}
        </p>
        {post.likes !== undefined && (
          <p className="text-xs text-muted-foreground">❤️ {post.likes} curtidas</p>
        )}
        {post.datetime && (
          <p className="text-xs text-muted-foreground">
            {format(new Date(post.datetime), "d 'de' MMMM 'de' yyyy", {
              locale: ptBR,
            })}
          </p>
        )}
      </div>
    </div>
  );
}
