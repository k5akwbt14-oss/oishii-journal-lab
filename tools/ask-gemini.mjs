#!/usr/bin/env node
// Gemini API helper — "team member" you can call from the command line.
//
// Usage:
//   node --env-file=.env tools/ask-gemini.mjs "your prompt here"
//   echo "long prompt from stdin" | node --env-file=.env tools/ask-gemini.mjs
//   node --env-file=.env tools/ask-gemini.mjs -m gemini-2.5-pro "harder question"
//   node --env-file=.env tools/ask-gemini.mjs --system "You are a strict editor" "review this"
//   node --env-file=.env tools/ask-gemini.mjs --image shot.png --image ref.png "compare these"
//
// Requires GEMINI_API_KEY in .env (get one at https://aistudio.google.com/apikey).

import { readFileSync } from "node:fs";
import { extname } from "node:path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is not set. Add it to .env and run with `node --env-file=.env ...`.");
  process.exit(1);
}

// --- parse args ---
const args = process.argv.slice(2);
let model = process.env.GEMINI_MODEL || "gemini-flash-lite-latest";
let system = null;
const images = [];
const promptParts = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "-m" || a === "--model") { model = args[++i]; }
  else if (a === "--system") { system = args[++i]; }
  else if (a === "--image") { images.push(args[++i]); }
  else { promptParts.push(a); }
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" };
function imagePart(path) {
  const mimeType = MIME[extname(path).toLowerCase()];
  if (!mimeType) {
    console.error(`ERROR: unsupported image type for ${path} (use png/jpg/webp/gif).`);
    process.exit(1);
  }
  return { inline_data: { mime_type: mimeType, data: readFileSync(path).toString("base64") } };
}

// prompt from args, else from stdin
async function readStdin() {
  if (process.stdin.isTTY) return "";
  const chunks = [];
  for await (const c of process.stdin) chunks.push(c);
  return Buffer.concat(chunks).toString("utf8").trim();
}

const prompt = promptParts.join(" ").trim() || (await readStdin());
if (!prompt && images.length === 0) {
  console.error("ERROR: no prompt provided (pass as arguments or via stdin).");
  process.exit(1);
}

// --- call Gemini ---
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const parts = [...images.map(imagePart)];
if (prompt) parts.push({ text: prompt });
const body = {
  contents: [{ role: "user", parts }],
};
if (system) body.systemInstruction = { parts: [{ text: system }] };

try {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`ERROR: Gemini API returned ${res.status} ${res.statusText}\n${errText}`);
    process.exit(1);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
  if (!text) {
    console.error("ERROR: empty response. Full payload:\n" + JSON.stringify(data, null, 2));
    process.exit(1);
  }
  process.stdout.write(text + "\n");
  process.exit(0); // force clean exit (avoids a libuv stdin assertion on Windows)
} catch (err) {
  console.error("ERROR: request failed —", err.message);
  process.exit(1);
}
