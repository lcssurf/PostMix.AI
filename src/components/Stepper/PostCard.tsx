import { cn } from "@/lib/utils";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { ImageIcon, VideoIcon } from "@radix-ui/react-icons"; // Importando os ícones do Radix

export type Post = {
  post_id: string;
  description?: string;
  photos: string[];
  url: string;
  video_url?: string | null;
  likes?: number;
  datetime?: string;
  videos?: string[];
};

type PostCardProps = {
  post: Post;
  selected: boolean;
  toggleSelect: () => void;
  disabled?: boolean;
};

export function PostCard({ post, selected, toggleSelect, disabled }: PostCardProps) {
  const isVideo = Boolean(post.videos);
  const isCarousel = post.photos.length > 1;
  const isImage = !isVideo && post.photos.length === 1;

  console.log("PostCard post", post);

  return (
    <div
      onClick={!disabled ? toggleSelect : undefined}
      className={cn(
        "border rounded-lg overflow-hidden transition shadow-sm",
        selected ? "border-primary ring-2 ring-primary/40" : "border-border",
        disabled ? "opacity-50 pointer-events-none select-none" : "cursor-pointer"
      )}
    >
      <div className="relative w-full aspect-square">
        <Image
          src={post.photos?.[0] || "/fallback-image.jpg"}
          alt="Post"
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />

        {/* Ícone sempre visível no canto superior direito */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {isCarousel ? (
            <div className="relative w-5 h-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="icon icon-tabler icons-tabler-filled icon-tabler-squares transform rotate-180"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M19 7a3 3 0 0 1 3 3v9a3 3 0 0 1 -3 3h-9a3 3 0 0 1 -3 -3v-9a3 3 0 0 1 3 -3z" />
                <path d="M14 2a3 3 0 0 1 3 2.999l-7 .001a5 5 0 0 0 -5 5l-.001 7l-.175 -.005a3 3 0 0 1 -2.824 -2.995v-9a3 3 0 0 1 3 -3z" />
              </svg>
            </div>
              ) : isVideo ? (
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-brand-youtube"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 3a5 5 0 0 1 5 5v8a5 5 0 0 1 -5 5h-12a5 5 0 0 1 -5 -5v-8a5 5 0 0 1 5 -5zm-9 6v6a1 1 0 0 0 1.514 .857l5 -3a1 1 0 0 0 0 -1.714l-5 -3a1 1 0 0 0 -1.514 .857z" /></svg>
              ) : isImage ?(
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-photo"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8.813 11.612c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.986 4.986l.094 .083a1 1 0 0 0 1.403 -1.403l-.083 -.094l-1.292 -1.293l.292 -.293l.106 -.095c.457 -.38 .918 -.38 1.386 .011l.108 .098l4.674 4.675a4 4 0 0 1 -3.775 3.599l-.206 .005h-12a4 4 0 0 1 -3.98 -3.603l6.687 -6.69l.106 -.095zm9.187 -9.612a4 4 0 0 1 3.995 3.8l.005 .2v9.585l-3.293 -3.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-.307 .306l-2.293 -2.292l-.15 -.137c-1.256 -1.095 -2.85 -1.097 -4.096 -.017l-.154 .14l-5.307 5.306v-9.585a4 4 0 0 1 3.8 -3.995l.2 -.005h12zm-2.99 5l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" /></svg>
          ): null}
            </div>
      </div>

        <div className="p-3 space-y-1 text-sm">
          <p className="font-medium line-clamp-2">
            {post.description || "Sem legenda"}
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
