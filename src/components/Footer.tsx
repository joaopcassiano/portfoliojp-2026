import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { revealOnScroll } from "../lib/scrollFx";
import { scrollToY } from "../lib/lenis";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Processo", href: "#processo" },
  { label: "Contato", href: "#contato" },
];

/** Rodapé: o logo inteiro ocupando a largura e os atalhos finais. */
export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Montado antes dos pins: medido depois deles
        const opts = { refreshPriority: -1 };
        revealOnScroll("[data-footer-row] > *", "[data-footer-row]", { y: 30, autoAlpha: 0 }, { ...opts, stagger: 0.08, start: "top 95%" });
        // O logo sobe de trás da borda inferior, como uma assinatura no fim da página
        revealOnScroll("[data-footer-logo]", "[data-footer-logo-wrap]", { yPercent: 100 }, { ...opts, duration: 1.6, start: "top 95%" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="relative overflow-hidden border-t border-bone/10 px-5 pt-12 md:px-10 md:pt-16 lg:px-14">
      <div data-footer-row className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-bone/70">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-bone">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <SocialLinks />
        <button
          type="button"
          onClick={() => scrollToY(0, 2)}
          className="group flex items-center gap-2 self-start text-sm text-bone/70 transition-colors hover:text-bone"
        >
          Voltar ao topo
          <span className="grid size-9 place-items-center rounded-full border border-bone/15 transition-colors group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
            <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5">
              <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      </div>

      <div data-footer-logo-wrap className="mt-14 overflow-hidden md:mt-20">
        <div data-footer-logo>
          <Logo className="h-auto w-full text-bone" />
        </div>
      </div>

      <p className="flex flex-col gap-1 py-6 text-[13px] text-mute sm:flex-row sm:justify-between">
        <span>© 2026 João Pedro Pereira Cassiano</span>
        <span>Desenhado e programado por mim, do layout ao código.</span>
      </p>
    </footer>
  );
}
