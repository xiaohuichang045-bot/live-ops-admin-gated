#!/usr/bin/env node
import { webcrypto } from "node:crypto";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const indexPath = resolve(root, "index.html");
const payloadPath = resolve(root, "payload.json");
const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();

function bytesFromBase64(value) {
  return Buffer.from(value, "base64");
}

async function deriveKey(password, payload) {
  const baseKey = await webcrypto.subtle.importKey(
    "raw",
    textEncoder.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );

  return webcrypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: bytesFromBase64(payload.salt),
      iterations: payload.iterations,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
}

async function tryDecrypt(answer, payload) {
  const key = await deriveKey(answer.trim(), payload);
  const decrypted = await webcrypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: bytesFromBase64(payload.iv),
    },
    key,
    bytesFromBase64(payload.data),
  );
  const bytes = payload.compression === "gzip"
    ? gunzipSync(new Uint8Array(decrypted))
    : new Uint8Array(decrypted);
  return textDecoder.decode(bytes);
}

function extractAnswers(indexHtml) {
  return Array.from(indexHtml.matchAll(/data-answer="([^"]+)"/g), (match) => match[1]);
}

function extractInlinePayload(indexHtml) {
  const match = indexHtml.match(/<script type="application\/json" id="encryptedPayload">\s*([\s\S]*?)\s*<\/script>/);
  const value = match?.[1]?.trim();
  if (!value || value === "__ENCRYPTED_PAYLOAD_JSON__") return null;
  return JSON.parse(value);
}

const [indexHtml, payloadText] = await Promise.all([
  readFile(indexPath, "utf8"),
  readFile(payloadPath, "utf8"),
]);
const payload = JSON.parse(payloadText);
const inlinePayload = extractInlinePayload(indexHtml);

if (inlinePayload && JSON.stringify(inlinePayload) !== JSON.stringify(payload)) {
  throw new Error("Inline payload does not match payload.json");
}

const answers = extractAnswers(indexHtml);
if (!answers.length) {
  throw new Error("No gate answers found in index.html");
}

const matches = [];
for (const answer of answers) {
  try {
    const bundleText = await tryDecrypt(answer, payload);
    JSON.parse(bundleText);
    matches.push(answer);
  } catch {
    // Expected for wrong answers.
  }
}

if (matches.length !== 1) {
  throw new Error(`Expected exactly one valid answer, found ${matches.length}: ${matches.join(", ") || "none"}`);
}

console.log(`Gate payload verified. Correct answer: ${matches[0]}`);
