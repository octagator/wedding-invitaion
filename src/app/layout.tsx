import type { Metadata, Viewport } from "next";
import { content } from "@/content/invitation";
import { script, serif, arabic } from "@/lib/fonts";
import { withBase } from "@/lib/paths";
import "./globals.css";

export const metadata: Metadata = {
  // The site URL includes any sub-path; Next resolves /og.jpg against it.
  // On Vercel the production address is known at build time, so nothing needs setting.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://youssef-hana.vercel.app"),
  ),
  title: content.share.title,
  description: content.share.description,
  robots: { index: false, follow: false, nocache: true },
  icons: { icon: withBase("/icon.svg"), apple: withBase("/apple-icon.png") },
  openGraph: {
    title: content.share.title,
    description: content.share.description,
    type: "website",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: content.share.title }],
  },
  twitter: {
    card: "summary_large_image",
    title: content.share.title,
    description: content.share.description,
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#efe5dc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${script.variable} ${serif.variable} ${arabic.variable}`}>
      <body>{children}</body>
    </html>
  );
}
