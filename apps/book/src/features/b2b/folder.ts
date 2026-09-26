import {
  getCategoryIdBySlug,
  getOccupationIdBySlug,
} from "@/lib/occupation-slug";
import {
  articlePath,
  categoryArticlePath,
  categoryPath,
  occupationPath,
} from "./paths";

// A content folder: the landing page (occupation or category) articles live
// under. Occupation and category behave identically everywhere except in how
// their URL is built and which slugs their articles may take — both captured
// here, so callers never branch on the kind.
export type Folder =
  | { kind: "occupation"; id: string }
  | { kind: "category"; id: string };

// Folder from its English CMS slug (CMS urls are keyed by English slug).
export function toFolder(enSlug: string): Folder | null {
  const occupationId = getOccupationIdBySlug("en", enSlug);
  if (occupationId) return { kind: "occupation", id: occupationId };
  const categoryId = getCategoryIdBySlug("en", enSlug);
  return categoryId ? { kind: "category", id: categoryId } : null;
}

// Public path of the landing page in `locale`.
export function folderPath(locale: string, folder: Folder): string | null {
  return folder.kind === "occupation"
    ? occupationPath(locale, folder.id)
    : categoryPath(locale, folder.id);
}

// Public path of one of its articles in `locale`.
export function folderArticlePath(
  locale: string,
  folder: Folder,
  articleSlug: string,
): string | null {
  return folder.kind === "occupation"
    ? articlePath(locale, folder.id, articleSlug)
    : categoryArticlePath(locale, folder.id, articleSlug);
}
