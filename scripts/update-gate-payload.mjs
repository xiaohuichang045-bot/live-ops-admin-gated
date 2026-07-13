#!/usr/bin/env node
import { webcrypto } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, extname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const adminRoot = resolve(root, "admin-current");
const indexPath = resolve(root, "index.html");
const payloadPath = resolve(root, "payload.json");
const iterations = 90000;
const textEncoder = new TextEncoder();

const mimeByExtension = new Map([
  [".css", "text/css"],
  [".html", "text/html"],
  [".js", "text/javascript"],
  [".json", "application/json"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".svg", "image/svg+xml"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
]);

function usage() {
  console.error("Usage: node scripts/update-gate-payload.mjs <gate-answer>");
  process.exit(1);
}

function toBase64(value) {
  return Buffer.from(value).toString("base64");
}

function mimeFor(path) {
  return mimeByExtension.get(extname(path).toLowerCase()) || "application/octet-stream";
}

function shouldBundle(path) {
  return !path.startsWith("prototype-versions/");
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await listFiles(absolutePath));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

async function createBundle() {
  await stat(resolve(adminRoot, "index.html"));
  const files = {};
  const paths = (await listFiles(adminRoot)).sort((a, b) => a.localeCompare(b));

  for (const absolutePath of paths) {
    const relativePath = relative(adminRoot, absolutePath).split(sep).join("/");
    if (!shouldBundle(relativePath)) continue;
    const content = await readFile(absolutePath);
    files[relativePath] = {
      mime: mimeFor(relativePath),
      content: toBase64(content),
    };
  }

  return JSON.stringify({
    version: 1,
    generatedAt: new Date().toISOString(),
    source: "admin-current",
    files,
  });
}

async function deriveKey(answer, salt) {
  const baseKey = await webcrypto.subtle.importKey(
    "raw",
    textEncoder.encode(answer.trim()),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return webcrypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
}

async function encryptBundle(answer, bundleText) {
  const salt = webcrypto.getRandomValues(new Uint8Array(16));
  const iv = webcrypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(answer, salt);
  const compressedBundle = gzipSync(bundleText, { level: 9 });
  const encrypted = await webcrypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    compressedBundle,
  );

  return {
    version: 1,
    algorithm: "PBKDF2-SHA256-AES-256-GCM",
    compression: "gzip",
    iterations,
    salt: toBase64(salt),
    iv: toBase64(iv),
    data: toBase64(new Uint8Array(encrypted)),
  };
}

async function updateInlinePayload(payload) {
  const indexHtml = await readFile(indexPath, "utf8");
  const payloadJson = JSON.stringify(payload, null, 2);
  const nextHtml = indexHtml.replace(
    /<script type="application\/json" id="encryptedPayload">\s*[\s\S]*?\s*<\/script>/,
    `<script type="application/json" id="encryptedPayload">\n${payloadJson}\n    </script>`,
  );

  if (nextHtml === indexHtml) {
    throw new Error("Could not find encryptedPayload script in index.html");
  }

  await Promise.all([
    writeFile(indexPath, nextHtml, "utf8"),
    writeFile(payloadPath, `${payloadJson}\n`, "utf8"),
  ]);
}

const answer = process.argv[2];
if (!answer) usage();

const bundleText = await createBundle();
const payload = await encryptBundle(answer, bundleText);
await updateInlinePayload(payload);
console.log(`Updated encrypted payload with ${JSON.parse(bundleText).files ? Object.keys(JSON.parse(bundleText).files).length : 0} files.`);
