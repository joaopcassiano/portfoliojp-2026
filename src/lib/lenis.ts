import type Lenis from "lenis";

// Instância global da rolagem suave, para componentes poderem rolar por código.
export const scroller: { lenis: Lenis | null } = { lenis: null };

export function scrollToY(y: number, duration = 2.4) {
  if (scroller.lenis) scroller.lenis.scrollTo(y, { duration });
  else window.scrollTo({ top: y, behavior: "smooth" });
}
