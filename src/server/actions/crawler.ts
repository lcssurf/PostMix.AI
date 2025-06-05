"use server";

export interface InstagramPost {
  url: string;
  images: string[];
  transcription: string;
  reel: boolean;
  video?: string;
  carousel: boolean;
}

export interface InstagramProfile {
  username: string;
  profilePicUrl: string;
  postsCount: string;     // ex: "227"
  followersCount: string; // ex: "1,978"
  followsCount: string;   // ex: "1,026"
  bio: string;
  scrapedAt: string;      // ISO date string
  posts: InstagramPost[];
}


export async function crawlUser(username: string): Promise<InstagramProfile> {
    const crawlerUrl = process.env.CRAWLER_URL;
    const crawlerApiKey = process.env.CRAWLER_API_KEY;

    if (!username) {
        throw new Error("Username is required");
    }
    if (!crawlerApiKey) {
        throw new Error("CRAWLER_API_KEY environment variable is not defined");
    }
    if (!crawlerUrl) {
        throw new Error("CRAWLER_URL environment variable is not defined");
    }
    const response = await fetch(crawlerUrl, {
        method: "POST",
        headers: {
            "X-API-Key": crawlerApiKey,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
    });

    if (!response.ok) {
        throw new Error(`Failed to crawl user: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Crawl Data for ${username}:`, data);
    return data;
}
