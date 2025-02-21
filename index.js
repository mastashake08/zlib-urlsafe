/**
 * @file index.js
 * @description Zlib + URL-safe Base64 (no external libs, modern browsers).
 */

/**
 * Decodes a URL-safe Base64 string into a Uint8Array.
 * @param {string} str - URL-safe Base64 string (e.g., from Python).
 * @returns {Uint8Array} raw bytes.
 */
export function decodeBase64UrlSafe(str) {
  // Convert URL-safe chars back to standard Base64
  str = str.replace(/-/g, '+').replace(/_/g, '/');

  // Pad with '=' if needed
  while (str.length % 4 !== 0) {
    str += '=';
  }

  // atob in browsers. Fallback to Buffer in Node if you wish.
  const binaryString = (typeof atob !== 'undefined')
    ? atob(str)
    : Buffer.from(str, 'base64').toString('binary');

  // Convert binary string to Uint8Array
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Encodes a Uint8Array to URL-safe Base64.
 * @param {Uint8Array} bytes - Raw bytes to encode.
 * @returns {string} URL-safe Base64 string.
 */
export function encodeBase64UrlSafe(bytes) {
  // Convert bytes to a binary string
  let binaryString = '';
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }

  // btoa in browsers. Fallback to Buffer in Node if needed.
  let base64 = (typeof btoa !== 'undefined')
    ? btoa(binaryString)
    : Buffer.from(binaryString, 'binary').toString('base64');

  // Make URL-safe
  base64 = base64.replace(/\+/g, '-').replace(/\//g, '_');

  // Remove potential '=' padding (optional but common for URL-safe)
  base64 = base64.replace(/=+$/, '');

  return base64;
}

/**
 * Compress a UTF-8 string with zlib (deflate) and encode it as URL-safe Base64.
 * Uses the native CompressionStream('deflate').
 * @param {string} inputStr - The string to compress.
 * @returns {Promise<string>} URL-safe Base64 of the compressed data.
 */
export async function compressZlibBase64UrlSafe(inputStr) {
  if (typeof CompressionStream === 'undefined') {
    throw new Error('CompressionStream is not supported in this environment.');
  }

  // 1. Convert the input string to bytes
  const inputBytes = new TextEncoder().encode(inputStr);

  // 2. Create a CompressionStream for 'deflate' (zlib style)
  const cs = new CompressionStream('deflate');
  const writer = cs.writable.getWriter();
  writer.write(inputBytes);
  writer.close();

  // 3. Read the compressed bytes
  const compressedChunks = [];
  const reader = cs.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    compressedChunks.push(value);
  }

  // 4. Concatenate all chunks
  let totalLength = 0;
  for (const chunk of compressedChunks) {
    totalLength += chunk.length;
  }
  const compressedBytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of compressedChunks) {
    compressedBytes.set(chunk, offset);
    offset += chunk.length;
  }

  // 5. Convert to URL-safe Base64
  return encodeBase64UrlSafe(compressedBytes);
}

/**
 * Decompress a zlib-compressed + URL-safe Base64 string into the original UTF-8 text.
 * Uses the native DecompressionStream('deflate').
 * @param {string} urlSafeB64 - The compressed URL-safe Base64 string.
 * @returns {Promise<string>} - The original uncompressed text.
 */
export async function decompressZlibBase64UrlSafe(urlSafeB64) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('DecompressionStream is not supported in this environment.');
  }

  // 1. Decode the URL-safe Base64 to raw bytes
  const compressedBytes = decodeBase64UrlSafe(urlSafeB64);

  // 2. Create a DecompressionStream for 'deflate' (zlib style)
  const ds = new DecompressionStream('deflate');
  const writer = ds.writable.getWriter();
  writer.write(compressedBytes);
  writer.close();

  // 3. Read decompressed data
  const decompressedChunks = [];
  const reader = ds.readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    decompressedChunks.push(value);
  }

  // 4. Concatenate all chunks
  let totalLength = 0;
  for (const chunk of decompressedChunks) {
    totalLength += chunk.length;
  }
  const decompressedBytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of decompressedChunks) {
    decompressedBytes.set(chunk, offset);
    offset += chunk.length;
  }

  // 5. Convert bytes to a UTF-8 string
  return new TextDecoder('utf-8').decode(decompressedBytes);
}
