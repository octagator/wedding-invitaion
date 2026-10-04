/**
 * The site may be served from a sub-path (GitHub Pages serves it under
 * /wedding-invitaion). Every absolute asset URL goes through withBase so the
 * same build works at the root on Vercel and under a prefix elsewhere.
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function withBase(path: string): string {
  return `${basePath}${path}`;
}
