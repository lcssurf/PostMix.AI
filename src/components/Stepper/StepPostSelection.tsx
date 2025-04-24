import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Post, PostCard } from "./PostCard";
import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  posts: Post[];
  onNext: (selected: Post[]) => void;
  disabled?: boolean;
  completed?: boolean;
  loading?: boolean;
  profile?: {
    profile_image_link: string;
    profile_url: string;
    username: string | null;
    account: string;
    biography?: string;
    followers?: number;
    following?: number;
    posts_count?: number;
    is_verified?: boolean;
    is_business_account?: boolean;
    category_name?: string;
    external_url?: string[];
  };

};

export function StepPostSelection({ posts, onNext, disabled, completed, loading, profile }: Props) {

  console.log("StepPostSelection posts", posts);
  
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string | number) => {
    const strId = String(id);
    setSelected((prev) =>
      prev.includes(strId) ? prev.filter((i) => i !== strId) : [...prev, strId].slice(0, 3)
    );
  };

  const proxiedImage = profile?.profile_image_link
    ? `/api/proxy-image?url=${encodeURIComponent(profile.profile_image_link)}`
    : undefined;

  return (
    <Card
      className={cn(
        disabled &&
        "pointer-events-none select-none blur-sm grayscale overflow-hidden"
      )}
    >
      <CardHeader>
        <CardTitle className="mb-4">📷 Selecione até 3 posts alinhados com o conteúdo que você deseja criar e clique em Analisar.</CardTitle>

        {profile && (
          <div className="flex items-start gap-4 p-4 border rounded-xl bg-muted/30 mt-4">
            <img
              src={proxiedImage}
              alt={profile.username || profile.account}
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div className="flex flex-col text-sm gap-0.5">
              <div>
                <a
                  href={profile?.profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold hover:underline"
                >
                  {/* {JSON.stringify(profile)} */}
                  @{profile?.username}
                </a>
                {/* {profile?.username && (
                  <span className="ml-2 text-muted-foreground">{profile?.username}</span>
                )} */}
              </div>

              {profile.followers !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {profile?.followers?.toLocaleString()} seguidores
                </span>
              )}

              {profile?.posts_count !== undefined && (
                <span className="text-xs text-muted-foreground">
                  {profile?.posts_count} publicações
                </span>
              )}

              {profile?.following !== undefined && (
                <span className="text-xs text-muted-foreground">
                  Seguindo {profile?.following.toLocaleString()}
                </span>
              )}

              {profile?.category_name && (
                <span className="text-xs text-muted-foreground">{profile?.category_name}</span>
              )}

              {profile?.biography && (
                <p className="text-xs text-muted-foreground mt-1 leading-snug">
                  {profile?.biography}
                </p>
              )}

              {(profile?.external_url ?? []).length > 0 && (
                <a
                  href={profile?.external_url?.[0]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:underline break-all mt-1"
                >
                  🔗 {profile?.external_url?.[0]}
                </a>
              )}
            </div>
          </div>
        )}

      </CardHeader>

      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {posts?.map((post) => (
          <PostCard
            key={post.post_id}
            post={post}
            selected={selected.includes(String(post.post_id))}
            toggleSelect={() => toggle(post.post_id)}
            disabled={disabled}
          />
        ))}
        {!disabled && (
          <div className="col-span-full">
            <Button
              onClick={() =>
                onNext(posts.filter((p) => selected.includes(String(p.post_id))))
              }
              disabled={selected.length === 0 || loading || completed}
            >
              {loading ? "Carregando..." : completed ? "Concluído" : "Analisar"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
