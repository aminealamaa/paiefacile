import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import { MetaPixel } from "@/components/MetaPixel";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

  return (
    <html lang="fr" dir="ltr">
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        {pixelId && <MetaPixel pixelId={pixelId} />}
        {children}
      </body>
    </html>
  );
}
