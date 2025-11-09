import { MetaPixel } from "@/components/MetaPixel";

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

  return (
    <>
      {pixelId && <MetaPixel pixelId={pixelId} />}
      {children}
    </>
  );
}
