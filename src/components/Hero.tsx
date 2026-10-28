import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import Magnetic from "./Magnetic";
import Navbar, { ArrowIcon } from "./Navbar";
import SocialLinks from "./SocialLinks";
import hero900Avif from "../assets/hero-900.avif";
import hero900Webp from "../assets/hero-900.webp";
import hero1672Avif from "../assets/hero-1672.avif";
import hero1672Webp from "../assets/hero-1672.webp";

const words = ["encanta.", "converte.", "se move.", "permanece."];

const services = [
  { n: "01", title: "UI/UX Design", meta: "Interfaces & design systems" },
  { n: "02", title: "Front-end", meta: "React · Next.js · TypeScript" },
  { n: "03", title: "Motion & Interação", meta: "GSAP · WebGL · Microinterações" },
];

/** Relógio ao vivo no fuso de São Paulo. */
function useLocalTime() {
  const fmt = () =>
    new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const time = useLocalTime();
  // Só divide o texto depois das fontes carregarem, para as linhas quebrarem no lugar certo.
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  useGSAP(
    () => {
      if (!fontsReady) return;
      const mm = gsap.matchMedia();

      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", fine: "(hover: hover) and (pointer: fine)" },
        (ctx) => {
          const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
          if (!motion) {
            gsap.set("[data-reveal]", { autoAlpha: 1 });
            return;
          }

          // ── Entrada ──────────────────────────────────────────────
          const headline = SplitText.create("[data-headline]", { type: "lines", mask: "lines", linesClass: "pb-[0.06em]" });
          const intro = SplitText.create("[data-intro]", { type: "lines", mask: "lines" });
          const wordmark = SplitText.create("[data-wordmark]", { type: "chars" });

          // Torna tudo visível antes de criar os "from", que então aplicam o estado inicial na hora.
          gsap.set("[data-reveal]", { autoAlpha: 1 });
          const tl = gsap.timeline({ defaults: { ease: "expo.out", duration: 1.2 } });

          tl.fromTo(
            "[data-frame]",
            { clipPath: "inset(18% 26% 18% 26% round 220px)" },
            { clipPath: "inset(0% 0% 0% 0% round var(--frame-radius))", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath" },
          )
            .fromTo(
              "[data-photo]",
              { scale: 1.45, filter: "grayscale(1) brightness(0.35) blur(8px)" },
              { scale: 1.1, filter: "grayscale(1) brightness(0.78) blur(0px)", duration: 2, ease: "expo.inOut" },
              0,
            )
            .from(wordmark.chars, { yPercent: 100, duration: 1.4, stagger: 0.035 }, 0.9)
            .from("[data-reveal='nav']", { y: -24, autoAlpha: 0, stagger: 0.08 }, 1.1)
            .from("[data-eyebrow]", { autoAlpha: 0, duration: 0.4 }, 1.15)
            .to("[data-eyebrow] [data-scramble]", { duration: 1.1, scrambleText: { text: "{original}", chars: "upperCase", speed: 0.6 }, ease: "none" }, 1.15)
            .from(headline.lines, { yPercent: 110, stagger: 0.1, duration: 1.3 }, 1.2)
            .from(intro.lines, { yPercent: 100, autoAlpha: 0, stagger: 0.06 }, 1.45)
            .from("[data-cta]", { y: 24, autoAlpha: 0, stagger: 0.08 }, 1.55)
            .from("[data-card]", { y: 40, autoAlpha: 0, stagger: 0.12, duration: 1.3 }, 1.5)
            .from("[data-service]", { x: 24, autoAlpha: 0, stagger: 0.08 }, 1.7)
            .from("[data-social]", { y: 16, autoAlpha: 0, stagger: 0.05, duration: 0.9 }, 1.7)
            .from("[data-scroll-cue]", { autoAlpha: 0, y: 10 }, 1.9);

          // ── Palavra rotativa ─────────────────────────────────────
          const items = gsap.utils.toArray<HTMLElement>("[data-word]");
          const hold = 2.4;
          gsap.set(items.slice(1), { yPercent: 110 });
          tl.from(items[0], { yPercent: 110, duration: 1.3 }, 1.35);

          const rotate = gsap.timeline({ repeat: -1, delay: 2.6 });
          items.forEach((el, i) => {
            const next = items[(i + 1) % items.length];
            rotate
              .to(el, { yPercent: -110, duration: 0.9, ease: "expo.inOut" }, i * hold + 1.5)
              .fromTo(next, { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.inOut" }, "<");
          });

          // ── Cursor: paralaxe da foto e luz que segue o mouse ─────
          if (fine) {
            const frame = root.current!.querySelector<HTMLElement>("[data-frame]")!;
            const photoX = gsap.quickTo("[data-photo-wrap]", "x", { duration: 1.4, ease: "power3.out" });
            const photoY = gsap.quickTo("[data-photo-wrap]", "y", { duration: 1.4, ease: "power3.out" });
            const markX = gsap.quickTo("[data-wordmark-wrap]", "x", { duration: 1.6, ease: "power3.out" });
            const lightX = gsap.quickTo("[data-light]", "x", { duration: 0.9, ease: "power3.out" });
            const lightY = gsap.quickTo("[data-light]", "y", { duration: 0.9, ease: "power3.out" });
            gsap.set("[data-light]", { x: frame.offsetWidth * 0.55, y: frame.offsetHeight * 0.35 });

            const onMove = (e: PointerEvent) => {
              const r = frame.getBoundingClientRect();
              const nx = (e.clientX - r.left) / r.width - 0.5;
              const ny = (e.clientY - r.top) / r.height - 0.5;
              photoX(nx * -28);
              photoY(ny * -18);
              markX(nx * 40);
              lightX(e.clientX - r.left);
              lightY(e.clientY - r.top);
            };
            frame.addEventListener("pointermove", onMove);
            return () => frame.removeEventListener("pointermove", onMove);
          }
        },
      );

      return () => mm.revert();
    },
    { scope: root, dependencies: [fontsReady] },
  );

  return (
    <section id="inicio" ref={root} className="relative h-svh min-h-[640px] p-2 md:p-3">
      <div data-frame className="relative h-full overflow-hidden rounded-[var(--frame-radius)] bg-ink">
        {/* ── Fundo: foto, luz, gradientes e granulação ── */}
        <div data-photo-wrap className="absolute -inset-8">
          <picture>
            <source type="image/avif" srcSet={`${hero900Avif} 900w, ${hero1672Avif} 1672w`} sizes="100vw" />
            <img
              data-photo
              src={hero1672Webp}
              srcSet={`${hero900Webp} 900w, ${hero1672Webp} 1672w`}
              sizes="100vw"
              alt="JP Cassiano olhando para cima, parado no meio de uma multidão em movimento"
              fetchPriority="high"
              className="h-full w-full scale-110 object-cover object-[50%_40%] [filter:grayscale(1)_brightness(0.78)]"
            />
          </picture>
        </div>

        <div
          data-light
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 hidden size-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full mix-blend-soft-light [background:radial-gradient(circle,rgb(255_138_99/0.55),rgb(255_90_44/0.12)_40%,transparent_68%)] [@media(hover:hover)]:block"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(9_9_10/0.88)_0%,rgb(9_9_10/0.35)_38%,transparent_60%,rgb(9_9_10/0.45)_100%)]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(9_9_10/0.55)_0%,transparent_22%,transparent_55%,rgb(9_9_10/0.92)_100%)]" />
        <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.22]" />

        {/* ── Nome gigante ao fundo ── */}
        <div data-wordmark-wrap aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
          <p
            data-wordmark
            className="display translate-y-[22%] text-[17vw] leading-[0.8] font-black whitespace-nowrap text-bone/[0.07] uppercase md:text-[15.6vw]"
            style={{ fontVariationSettings: '"wdth" 125' }}
          >
            Cassiano
          </p>
        </div>

        <Navbar />

        {/* ── Conteúdo principal ── */}
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pt-28 pb-24 md:justify-center md:px-10 md:pb-28 lg:px-14">
          <div className="max-w-[640px]">
            <div data-eyebrow data-reveal className="eyebrow mb-6 flex items-center gap-3 text-mute">
              <span className="size-1.5 rounded-full bg-ember" />
              <span data-scramble className="whitespace-nowrap">Design Developer</span>
              <span className="h-px w-10 bg-bone/20" />
              <span data-scramble className="whitespace-nowrap">©2026</span>
            </div>

            <h1 data-reveal className="display text-[clamp(44px,7.4vw,112px)] leading-[0.92] font-light tracking-[-0.02em] uppercase">
              <span data-headline className="block">
                Design que
              </span>
              <span className="relative block overflow-hidden pb-[0.08em]">
                <span className="sr-only">encanta, converte, se move, permanece.</span>
                <span aria-hidden="true" className="grid font-serif text-[1.08em] tracking-[-0.01em] normal-case italic">
                  {words.map((w) => (
                    <span key={w} data-word className="col-start-1 row-start-1 whitespace-nowrap">
                      {w.slice(0, -1)}
                      <span className="text-ember">.</span>
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            <p data-intro data-reveal className="mt-6 max-w-[420px] text-[15px] leading-relaxed text-bone/70 md:text-base">
              Sou JP Cassiano, design developer. Desenho e desenvolvo sites e produtos digitais em que estética,
              performance e movimento trabalham juntos — do primeiro rascunho ao último pixel em produção.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <div data-cta data-reveal>
                <Magnetic>
                  <a
                    href="#projetos"
                    className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-bone py-2 pr-2 pl-6 text-sm font-medium text-ink"
                  >
                    <span className="absolute inset-0 translate-y-full rounded-full bg-ember transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                    <span className="relative">Ver projetos</span>
                    <span className="relative grid size-9 place-items-center rounded-full bg-ink text-bone">
                      <ArrowIcon className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                    </span>
                  </a>
                </Magnetic>
              </div>
              <a
                data-cta
                data-reveal
                href="#sobre"
                className="group relative px-4 py-3 text-sm text-bone/80 transition-colors hover:text-bone"
              >
                Sobre mim
                <span className="absolute inset-x-4 bottom-2 h-px origin-right scale-x-0 bg-ember transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Cartão de serviços (direita) ── */}
        <aside
          data-card
          data-reveal
          aria-label="O que eu faço"
          className="absolute top-28 right-10 z-10 hidden w-[300px] lg:block xl:right-14 xl:w-[320px]"
        >
          <p className="mb-3 flex items-center justify-between text-sm">
            <span>O que eu faço</span>
            <span className="eyebrow text-dim">03</span>
          </p>
          <ul className="flex flex-col gap-2">
            {services.map((s) => (
              <li key={s.n} data-service>
                <a
                  href="#servicos"
                  className="glass group flex items-center gap-3 rounded-2xl p-2 pr-4 transition-colors duration-300 hover:border-bone/25 hover:bg-carbon/70"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-bone/[0.06] font-mono text-xs text-mute transition-colors duration-300 group-hover:bg-ember group-hover:text-ink">
                    {s.n}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-bone">{s.title}</span>
                    <span className="block truncate text-xs text-mute">{s.meta}</span>
                  </span>
                  <ArrowIcon className="size-3 text-dim transition-[color,transform] duration-500 ease-out-expo group-hover:rotate-45 group-hover:text-bone" />
                </a>
              </li>
            ))}
          </ul>
        </aside>

        {/* ── Rodapé da hero: redes, indicador de rolagem e status ── */}
        <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 px-5 pb-5 md:px-10 md:pb-8 lg:px-14">
          <div className="flex flex-col gap-3">
            <p data-reveal data-card className="eyebrow hidden text-mute md:block">
              Me encontre nas redes
            </p>
            <SocialLinks />
          </div>

          <a
            href="#sobre"
            data-scroll-cue
            data-reveal
            className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-mute transition-colors hover:text-bone lg:flex"
          >
            <span className="eyebrow">Role</span>
            <span className="relative h-10 w-px overflow-hidden bg-bone/15">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-bone" />
            </span>
          </a>

          <div data-card data-reveal className="glass hidden w-[300px] rounded-2xl p-4 md:block xl:w-[320px]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-live/70" />
                <span className="relative size-2 rounded-full bg-live" />
              </span>
              <span className="text-[13px]">Disponível para novos projetos</span>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-bone/10 pt-3">
              <div>
                <p className="eyebrow text-dim">Baseado em</p>
                <p className="mt-1 text-[13px] text-bone/85">Brasil · Remoto</p>
              </div>
              <div className="text-right">
                <p className="eyebrow text-dim">Hora local</p>
                <p className="mt-1 font-mono text-[13px] text-bone/85 tabular-nums">{time} BRT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
