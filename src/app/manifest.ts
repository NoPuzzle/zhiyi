import type { MetadataRoute } from "next";
import { withBasePath } from "@/lib/base-path";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "知易 / Zhiyi",
    short_name: "知易",
    description: "以象入易，以问观心",
    lang: "zh-Hans",
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    orientation: "portrait",
    background_color: "#F3F1EA",
    theme_color: "#F3F1EA",
    categories: ["education", "books", "productivity"],
    icons: [
      {
        src: withBasePath("/icons/zhiyi-icon-192.png"),
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBasePath("/icons/zhiyi-icon-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: withBasePath("/icons/zhiyi-maskable-512.png"),
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: withBasePath("/icons/zhiyi-icon.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: withBasePath("/icons/zhiyi-maskable.svg"),
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
