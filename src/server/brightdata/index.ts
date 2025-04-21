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
    const urls = usernames.map((u) => `https://www.instagram.com/${u}/`);
    const payload = urls.map((url) => ({ url }));
    const url = `${BASE_URL}/trigger?dataset_id=${DATASET_ID_INSTAGRAM}&include_errors=true`;
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

  async fetchInstagramProfileWithPolling(username: string, maxAttempts = 15, intervalMs = 5000) {
    const trigger = await this.triggerInstagramCollection([username]);
    const snapshotId = trigger?.snapshot_id;

    if (!snapshotId) throw new Error("Snapshot ID não encontrado após trigger.");

    let attempt = 0;
    while (attempt < maxAttempts) {
      const progress = await this.checkSnapshotProgress(snapshotId);

      if (progress?.status === "ready") {
        return await this.fetchSnapshotData(snapshotId);
      }

      if (progress?.status === "failed") {
        throw new Error(`Coleta de dados falhou para snapshot ${snapshotId}`);
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
      attempt++;
    }

    throw new Error(`Timeout: Snapshot ${snapshotId} não ficou pronto após ${maxAttempts} tentativas.`);
  },
};
