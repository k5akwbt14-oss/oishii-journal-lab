#!/usr/bin/env node
// Gemini image-generation helper — teammate script for creating site assets.
//
// Usage:
//   node --env-file=.env tools/gen-image.mjs "a red fox illustration" --out out.png
//   node --env-file=.env tools/gen-image.mjs "same style, but a cat" --image ref.png --out cat.png
//   node --env-file=.env tools/gen-image.mjs "washi paper texture" --ar 16:9 --out texture.png
//   node --env-file=.env tools/gen-image.mjs -m gemini-2.5-flash-image "..." --out x.png
//
// Options:
//   --out <path>     (required) where to save the generated image
//   --image <path>   input reference image(s) for style-reference / editing (repeatable)
//   --ar <aspect>    aspect ratio hint, e.g. 16:9 — appended to the prompt text
//   -m, --model      override model (default: gemini-2.5-flash-image)
//
// Requires GEMINI_API_KEY in .env (billing must be enabled for image models).

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { extname, dirname } from "node:path";

const API_KEY = process.env.GEMINI_API_KEY;
if (!API_KEY) {
  console.error("ERROR: GEMINI_API_KEY is not set. Add it to .env and run with `node --env-file=.env ...`.");
  process.exit(1);
}

// --- parse args ---
const args = process.argv.slice(2);
let model = process.env.GEMINI_IMAGE_MODEL || "gemini-2.5-flash-image";
let out = null;
let aspect = null;
const images = [];
const promptParts = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "-m" || a === "--model") { model = args[++i]; }
  else if (a === "--out") { out = args[++i]; }
  else if (a === "--image") { images.push(args[++i]); }
  else if (a === "--ar") { aspect = args[++i]; }
  else { promptParts.push(a); }
}

if (!out) {
  console.error("ERROR: --out <path> is required.");
  process.exit(1);
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

let prompt = promptParts.join(" ").trim();
if (!prompt) {
  console.error("ERROR: no prompt provided.");
  process.exit(1);
}
if (aspect) prompt += ` (aspect ratio ${aspect})`;

// --- call Gemini ---
const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const parts = [...images.map(imagePart), { text: prompt }];
const body = {
  contents: [{ role: "user", parts }],
};

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
  const respParts = data?.candidates?.[0]?.content?.parts ?? [];
  // handle both snake_case (inline_data/mime_type) and camelCase (inlineData/mimeType)
  const imgPart = respParts.find((p) => p.inline_data?.data || p.inlineData?.data);
  const textOut = respParts.filter((p) => p.text).map((p) => p.text).join("\n");

  if (!imgPart) {
    console.error("ERROR: no image in response." + (textOut ? `\nModel text:\n${textOut}` : "") +
      "\nFull payload:\n" + JSON.stringify(data, null, 2));
    process.exit(1);
  }

  const inline = imgPart.inline_data ?? imgPart.inlineData;
  const mime = inline.mime_type ?? inline.mimeType ?? "image/png";
  const buf = Buffer.from(inline.data, "base64");
  mkdirSync(dirname(out) || ".", { recursive: true });
  writeFileSync(out, buf);
  console.log(`Saved ${out} (${mime}, ${(buf.length / 1024).toFixed(1)} KB)`);
  if (textOut) console.log(`Model note: ${textOut}`);
  process.exit(0); // force clean exit (avoids a libuv stdin assertion on Windows)
} catch (err) {
  console.error("ERROR: request failed —", err.message);
  process.exit(1);
}
