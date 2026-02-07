import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const { VERCEL_TOKEN, VERCEL_PROJECTID, VERCEL_TEAM_ID } = process.env;

if (!VERCEL_TOKEN || !VERCEL_PROJECTID) {
  throw new Error("Missing VERCEL_TOKEN or VERCEL_PROJECTID in .env");
}

const TARGET = "production";

// Helper: fetch + JSON + error handling
async function fetchJson(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch error ${res.status}: ${text}`);
  }
  return res.json();
}

// Read local .env
const envPath = path.resolve(process.cwd(), ".env");
const envFile = fs.readFileSync(envPath, "utf-8");
const localEnv = dotenv.parse(envFile);

console.log("Local .env variables:", localEnv);

// Sync environment variables to Vercel
async function syncEnv() {
  const projectId = VERCEL_PROJECTID;

  // 1️⃣ Get remote envs
  let remoteEnv: any[] = [];
  try {
    const url = new URL(`https://api.vercel.com/v9/projects/${projectId}/env`);
    if (VERCEL_TEAM_ID) url.searchParams.append("teamId", VERCEL_TEAM_ID);

    const data: any = await fetchJson(url.toString(), {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
    });

    remoteEnv = data.envs || [];
  } catch (err) {
    console.warn("Could not fetch remote envs, continuing...");
  }

  // 2️⃣ Loop through local env and sync
  for (const [key, value] of Object.entries(localEnv)) {
    // Delete existing
    const existing = remoteEnv.find((e) => e.key === key);
    if (existing) {
      const delUrl = `https://api.vercel.com/v9/projects/${projectId}/env/${existing.id}${
        VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ""
      }`;
      await fetch(delUrl, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
      });
      console.log(`🗑️ Removed existing variable: ${key}`);
    }

    // Add new
    const postUrl = `https://api.vercel.com/v9/projects/${projectId}/env${
      VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ""
    }`;

    await fetch(postUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key,
        value,
        type: "encrypted",
        target: [TARGET],
      }),
    });

    console.log(`✅ Synced variable: ${key}`);
  }
}

// Run
syncEnv().catch((err) => {
  console.error("Error syncing environment variables:", err);
});
