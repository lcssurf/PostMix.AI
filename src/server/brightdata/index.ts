// lib/brightdata-service.ts
import axios from "axios";

const BRIGHTDATA_API_KEY = process.env.BRIGHTDATA_API_KEY;
const DATASET_ID_INSTAGRAM = process.env.DATASET_ID_INSTAGRAM;
const DATASET_ID_TIKTOK = process.env.DATASET_ID_TIKTOK;

if (!BRIGHTDATA_API_KEY) throw new Error("Missing BRIGHTDATA_API_KEY in environment.");

const BASE_URL = "https://api.brightdata.com/datasets/v3";
const headers = {
  Authorization: `Bearer ${BRIGHTDATA_API_KEY}`,
  "Content-Type": "application/json",
};

export const BrightDataService = {

  async triggerInstagramCollection(usernames: string[]) {
    if (!DATASET_ID_INSTAGRAM) throw new Error("Missing DATASET_ID_INSTAGRAM");
  
    const payload = usernames.map((username) => ({
      url: `https://www.instagram.com/${username}/`,
      num_of_posts: 10,                 // 👈 Limite de posts
      // post_type: "Post",                // 👈 Apenas posts (sem Reels, opcional)
      // start_date: "",                   // Opcional — você pode remover se não quiser limitar por data
      // end_date: ""
    }));
  
    const url = `${BASE_URL}/trigger?dataset_id=${DATASET_ID_INSTAGRAM}&include_errors=true&type=discover_new&discover_by=url`;
    const response = await axios.post(url, payload, { headers });
  
    return response.data;
  },
  

  async checkSnapshotProgress(snapshotId: string) {
    const url = `${BASE_URL}/progress/${snapshotId}`;
    const response = await axios.get(url, { headers });
    return response.data;
  },

  async fetchSnapshotData(snapshotId: string) {
    const url = `${BASE_URL}/snapshot/${snapshotId}`;
    const response = await axios.get(url, { headers });
    return response.data;
  },

  async fetchInstagramProfileWithPolling(username: string, maxAttempts = 15, baseIntervalMs = 2000) {
    const trigger = await this.triggerInstagramCollection([username]);
    const snapshotId = trigger?.snapshot_id;
  
    if (!snapshotId) throw new Error("Snapshot ID não encontrado após trigger.");
  
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const progress = await this.checkSnapshotProgress(snapshotId);
  
      if (progress?.status === "ready") {
        const raw = await this.fetchSnapshotData(snapshotId);
      
        // Se vier como string, fazer o parse linha a linha
        if (typeof raw === "string") {
          const lines = raw.trim().split(/\n+/);
          const parsed = lines.map(line => JSON.parse(line)).filter(Boolean);
          return parsed;
        }
      
        // Se já for array, retorna direto
        if (Array.isArray(raw)) return raw;
      
        // Se for um único objeto
        return [raw];
      }
      
  
      if (progress?.status === "failed") {
        throw new Error(`Coleta de dados falhou para snapshot ${snapshotId}`);
      }
  
      const delay = Math.min(baseIntervalMs * Math.pow(2, attempt), 20000); // Ex: 2s, 4s, 8s, ...
      console.log(`Tentativa ${attempt + 1}: snapshot ainda não está pronto. Aguardando ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  
    throw new Error(`Timeout: Snapshot ${snapshotId} não ficou pronto após ${maxAttempts} tentativas.`);
  }
  

};
