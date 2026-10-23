import { createReadStream } from "node:fs";
import { access, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const outputDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../out");
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/zhiyi";
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".avif": "image/avif",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

try {
  await access(resolve(outputDirectory, "index.html"));
} catch {
  throw new Error("Missing out/index.html. Run npm run build:pages before browser tests.");
}

createServer(async (request, response) => {
  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405).end();
    return;
  }

  try {
    const pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
    if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
      response.writeHead(404).end();
      return;
    }

    let filePath = resolve(outputDirectory, `.${pathname.slice(basePath.length) || "/"}`);
    if (filePath !== outputDirectory && !filePath.startsWith(`${outputDirectory}${sep}`)) {
      response.writeHead(403).end();
      return;
    }

    let metadata = await stat(filePath);
    if (metadata.isDirectory()) {
      filePath = resolve(filePath, "index.html");
      metadata = await stat(filePath);
    }
    if (!metadata.isFile()) {
      response.writeHead(404).end();
      return;
    }

    response.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] ?? "application/octet-stream",
      "Content-Length": metadata.size,
      "Cache-Control": "no-store",
    });
    if (request.method === "HEAD") {
      response.end();
    } else {
      createReadStream(filePath).pipe(response);
    }
  } catch {
    response.writeHead(404).end();
  }
}).listen(4178, "127.0.0.1", () => {
  console.log(`Browser test export: http://127.0.0.1:4178${basePath}/`);
});
