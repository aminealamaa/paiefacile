import { MetaPixel } from "@/components/MetaPixel";
import { getDirection, getLangCode, type Locale } from "@/lib/i18n-utils";
import "../rtl.css";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
  const locale = (localeParam || 'fr') as Locale;
  const dir = getDirection(locale);
  const lang = getLangCode(locale);

  return (
    <div dir={dir} lang={lang}>
      {pixelId && <MetaPixel pixelId={pixelId} />}
      {children}
    </div>
  );
}
