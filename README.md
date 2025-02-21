# zlib-urlsafe

> **Zlib** compress/decompress + **URL-safe Base64** encoding/decoding — all **native** in modern browsers, **no external libs**.

This package provides four functions:

1. **decodeBase64UrlSafe(str)**  
2. **encodeBase64UrlSafe(bytes)**  
3. **compressZlibBase64UrlSafe(str)**  
4. **decompressZlibBase64UrlSafe(str)**

They rely on **`CompressionStream`** and **`DecompressionStream`** (`'deflate'` mode) to handle **zlib** data.

## Installation

```
npm install zlib-urlsafe
```
