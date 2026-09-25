import { getB2bTranslations } from "./pricing";

// Plural audience of a category, for copy shared with occupation pages
// ("Online booking for {occupations}"): "beauty & wellness pros",
// "professionnels de la beauté et du bien-être".
export async function getCategoryAudience(
  locale: string,
  categoryId: string,
): Promise<string> {
  const t = await getB2bTranslations(locale, "b2b.audience");
  return t(categoryId);
}
