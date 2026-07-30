import type { Metadata } from "next";
import type { Viewport } from "next";
import Link from "next/link";
import { ServiceWorkerRegistration } from "@/components/pwa/ServiceWorkerRegistration";
import { withBasePath } from "@/lib/base-path";
import "./globals.css";

export const metadata: Metadata = {
  applicationName: "知易 / Zhiyi",
  title: {
    default: "知易 / Zhiyi",
    template: "%s · 知易",
  },
  description: "以象入易，以问观心",
  manifest: withBasePath("/manifest.webmanifest"),
  icons: {
    icon: [
      {
        url: withBasePath("/icons/zhiyi-icon-192.png"),
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: withBasePath("/icons/zhiyi-icon.svg"),
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: withBasePath("/icons/apple-touch-icon.png"),
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  appleWebApp: {
    capable: true,
    title: "知易",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F3F1EA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans" className="h-full antialiased">
      <body className="min-h-full bg-paper text-ink">
        <ServiceWorkerRegistration />
        <div className="paper-grain min-h-dvh">
          <header className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
            <Link
              href="/"
              className="flex flex-col leading-none"
              aria-label="知易首页"
            >
              <span className="text-xl font-semibold tracking-normal">知易</span>
              <span className="mt-1 text-[0.68rem] uppercase tracking-[0.22em] text-ink-soft">
                Zhiyi
              </span>
            </Link>

            <nav
              className="flex items-center gap-3 text-sm text-ink-soft"
              aria-label="主导航"
            >
              <Link className="transition hover:text-ink" href="/learn">
                学易
              </Link>
              <Link className="transition hover:text-ink" href="/ask">
                问卦
              </Link>
              <Link className="transition hover:text-ink" href="/hexagrams">
                观象
              </Link>
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
