import { useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import Magnetic from "./Magnetic";
import SocialLinks from "./SocialLinks";
import Logo from "./Logo";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Serviços", href: "#servicos" },
  { label: "Contato", href: "#contato" },
];

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className={className}>
      <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const root = useRef<HTMLElement>(null);
  const pill = useRef<HTMLUListElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const menuTl = useRef<gsap.core.Timeline>(null);
  const [active] = useState(0);
  const [open, setOpen] = useState(false);

  // Indicador da pílula: desliza até o link sob o cursor e volta ao ativo.
  const { contextSafe } = useGSAP(
    () => {
      moveIndicator(active, true);

      menuTl.current = gsap
        .timeline({ paused: true, defaults: { ease: "expo.out" } })
        .set(menu.current, { autoAlpha: 1 })
        .fromTo(menu.current, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 0.8, ease: "expo.inOut" })
        .from("[data-menu-link]", { yPercent: 110, duration: 0.9, stagger: 0.06 }, "-=0.35")
        .from("[data-menu-foot]", { autoAlpha: 0, y: 12, duration: 0.6 }, "-=0.6");
    },
    { scope: root },
  );

  const moveIndicator = contextSafe((index: number, instant = false) => {
    const item = pill.current?.children[index + 1] as HTMLElement | undefined; // [0] é o indicador
    if (!item || !indicator.current) return;
    gsap.to(indicator.current, {
      x: item.offsetLeft,
      width: item.offsetWidth,
      duration: instant ? 0 : 0.55,
      ease: "power3.out",
    });
  });

  const toggleMenu = contextSafe(() => {
    const next = !open;
    setOpen(next);
    document.documentElement.style.overflow = next ? "hidden" : "";
    if (next) menuTl.current?.timeScale(1).play();
    else menuTl.current?.timeScale(1.6).reverse();
  });

  return (
    <header ref={root} className="absolute inset-x-0 top-0 z-30">
      <nav aria-label="Principal" className="relative z-50 grid grid-cols-[1fr_auto] items-center gap-4 px-5 pt-5 md:grid-cols-[1fr_auto_1fr] md:px-8 md:pt-6">
        {/* Marca */}
        <a href="#inicio" data-reveal="nav" className="group flex items-center gap-2.5 justify-self-start" aria-label="JP Cassiano, voltar ao início">
          <Logo className="h-5 w-auto text-bone md:h-[22px]" />
        </a>

        {/* Pílula de navegação (desktop) */}
        <ul
          ref={pill}
          data-reveal="nav"
          onPointerLeave={() => moveIndicator(active)}
          className="glass relative hidden items-center rounded-full p-1.5 md:flex"
        >
          <span ref={indicator} aria-hidden="true" className="absolute top-1.5 bottom-1.5 left-0 rounded-full bg-bone/12 ring-1 ring-bone/15" />
          {links.map((l, i) => (
            <li key={l.href} className="relative">
              <a
                href={l.href}
                aria-current={i === active ? "page" : undefined}
                onPointerEnter={() => moveIndicator(i)}
                onFocus={() => moveIndicator(i)}
                className={`block rounded-full px-4 py-2 text-[13px] tracking-wide transition-colors duration-300 lg:px-5 ${
                  i === active ? "text-bone" : "text-bone/60 hover:text-bone"
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        {/* CTA (desktop) + botão de menu (mobile) */}
        <div data-reveal="nav" className="flex items-center gap-2 justify-self-end">
          <div className="hidden lg:block">
            <Magnetic strength={0.25}>
              <a
                href="#contato"
                className="group flex items-center gap-3 rounded-full bg-bone py-1.5 pr-1.5 pl-5 whitespace-nowrap text-[13px] font-medium text-ink transition-colors duration-300 hover:bg-white"
              >
                Vamos conversar
                <span className="grid size-8 place-items-center overflow-hidden rounded-full bg-ink text-bone">
                  <ArrowIcon className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                </span>
              </a>
            </Magnetic>
          </div>
          <button
            type="button"
            onClick={toggleMenu}
            aria-expanded={open}
            aria-controls="menu-mobile"
            className="glass flex h-11 items-center gap-2.5 rounded-full px-4 text-[13px] md:hidden"
          >
            {open ? "Fechar" : "Menu"}
            <span className="flex flex-col gap-[3px]" aria-hidden="true">
              <span className={`h-px w-3.5 bg-current transition-transform duration-300 ${open ? "translate-y-[2px] rotate-45" : ""}`} />
              <span className={`h-px w-3.5 bg-current transition-transform duration-300 ${open ? "-translate-y-[2px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* Menu em tela cheia (mobile) */}
      <div
        ref={menu}
        id="menu-mobile"
        className="invisible fixed inset-0 z-40 flex flex-col justify-between bg-graphite px-5 pt-24 pb-8 md:hidden"
      >
        <ul className="flex flex-col gap-1">
          {links.map((l, i) => (
            <li key={l.href} className="overflow-hidden">
              <a
                href={l.href}
                data-menu-link
                onClick={toggleMenu}
                className="display flex items-baseline gap-4 py-1 text-[13vw] leading-[1] font-light uppercase"
              >
                <span className="font-mono text-xs text-ember">0{i + 1}</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div data-menu-foot className="flex flex-col gap-5">
          <p className="eyebrow text-mute">Me encontre nas redes</p>
          <SocialLinks className="flex-wrap" />
        </div>
      </div>
    </header>
  );
}
