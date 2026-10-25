const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Prefixes a public/ path with the deploy base path (GitHub Pages project sites). */
export function asset(path: string): string {
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}
