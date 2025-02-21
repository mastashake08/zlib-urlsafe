# zlib-urlsafe

> **Zlib** compress/decompress + **URL-safe Base64** encoding/decoding — all **native** in modern browsers, **no external libs**.

This package provides four functions:

1. **decodeBase64UrlSafe(str)**  
2. **encodeBase64UrlSafe(bytes)**  
3. **compressZlibBase64UrlSafe(str)**  
4. **decompressZlibBase64UrlSafe(str)**

They rely on **`CompressionStream`** and **`DecompressionStream`** (`'deflate'` mode) to handle **zlib** data.

## Installation

```bash
npm install @mastashake08/zlib-urlsafe
```

*(You can publish to npm under your chosen package name.)*

## Usage

```js
import {
  compressZlibBase64UrlSafe,
  decompressZlibBase64UrlSafe
} from '@mastashake08/zlib-urlsafe';

(async () => {
  const original = 'Hello, compress me!';
  
  // Compress
  const compressed = await compressZlibBase64UrlSafe(original);
  console.log('Compressed (URL-safe Base64):', compressed);
  
  // Decompress
  const result = await decompressZlibBase64UrlSafe(compressed);
  console.log('Decompressed result:', result); // "Hello, compress me!"
})();
```

### `encodeBase64UrlSafe` / `decodeBase64UrlSafe`

If you only need to handle URL-safe Base64:

```js
import {
  encodeBase64UrlSafe,
  decodeBase64UrlSafe
} from '@mastashake08/zlib-urlsafe';

const dataBytes = new Uint8Array([ 0x48, 0x69 ]); // "Hi"
const b64Url = encodeBase64UrlSafe(dataBytes); 
// e.g. "SGk" (no padding)

const decoded = decodeBase64UrlSafe(b64Url);
// Uint8Array([72, 105]) => "Hi"
```

## Browser Compatibility

- Requires **`CompressionStream`** and **`DecompressionStream`**.  
- Supported in Chrome 80+, Edge 79+, Safari 15.4+, Firefox 101+ (behind a flag).  
- Node.js 19+ partially supports it behind experimental flags.  
- **Older browsers / Node versions**: You need a polyfill or a library like [pako](https://github.com/nodeca/pako).  

## License

[MIT](LICENSE) (or your chosen license).
```
