import "server-only";
import { highlight } from "sugar-high";

/** Tokenize once at build time (static pages) instead of on every client
 *  render. Returns an HTML string for dangerouslySetInnerHTML. */
export function highlightCode(code: string): string {
  return highlight(code);
}
