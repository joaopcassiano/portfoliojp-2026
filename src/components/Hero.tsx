import { useEffect, useRef, useState, type CSSProperties } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import Magnetic from "./Magnetic";
import Navbar, { ArrowIcon } from "./Navbar";
import Logo from "./Logo";
import SocialLinks from "./SocialLinks";
import { scrollToY } from "../lib/lenis";
import hero900Avif from "../assets/hero-900.avif";
import hero900Webp from "../assets/hero-900.webp";
import hero1672Avif from "../assets/hero-1672.avif";
import hero1672Webp from "../assets/hero-1672.webp";

const words = ["encanta.", "converte.", "se move.", "permanece."];

const services = [
  { n: "01", title: "UI/UX Design", meta: "Interfaces e design systems" },
  { n: "02", title: "Front-end", meta: "HTML, CSS, JavaScript e TypeScript" },
  { n: "03", title: "Motion e interação", meta: "Animações com GSAP" },
];

// Posição do rosto na foto original (em % da imagem). É o ponto de origem do zoom
// e o centro da máscara que revela a cor.
const FACE = { x: "52.5%", y: "41%" };

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

function Photo({ color = false }: { color?: boolean }) {
  return (
    <picture>
      <source type="image/avif" srcSet={`${hero900Avif} 900w, ${hero1672Avif} 1672w`} sizes="(max-width: 768px) 200vw, 100vw" />
      <img
        data-photo={color ? "color" : "mono"}
        src={hero1672Webp}
        srcSet={`${hero900Webp} 900w, ${hero1672Webp} 1672w`}
        sizes="(max-width: 768px) 200vw, 100vw"
        alt={color ? "" : "JP Cassiano olhando para cima, parado no meio de uma multidão em movimento"}
        aria-hidden={color || undefined}
        fetchPriority={color ? undefined : "high"}
        className={`absolute inset-0 h-full w-full ${
          color ? "[filter:saturate(1.35)_contrast(1.05)_brightness(0.95)]" : "[filter:grayscale(1)_brightness(0.78)]"
        }`}
        style={
          color
            ? ({
                "--s": 0,
                maskImage: `radial-gradient(ellipse calc(var(--s) * 13%) calc(var(--s) * 25%) at ${FACE.x} ${FACE.y}, #000 50%, transparent 100%)`,
                WebkitMaskImage: `radial-gradient(ellipse calc(var(--s) * 13%) calc(var(--s) * 25%) at ${FACE.x} ${FACE.y}, #000 50%, transparent 100%)`,
              } as CSSProperties)
            : undefined
        }
      />
    </picture>
  );
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
        {
          motion: "(prefers-reduced-motion: no-preference)",
          fine: "(hover: hover) and (pointer: fine)",
          desktop: "(min-width: 1024px)",
        },
        (ctx) => {
          const { motion, fine, desktop } = ctx.conditions as { motion: boolean; fine: boolean; desktop: boolean };

          // Sem animação: mostra o estado final direto, com o rosto já colorido.
          if (!motion) {
            gsap.set("[data-reveal]", { autoAlpha: 1 });
            gsap.set("[data-cue]", { autoAlpha: 0 });
            gsap.set("[data-shade]", { autoAlpha: 1 });
            gsap.set("[data-stage]", { scale: desktop ? 1.55 : 1.2, x: desktop ? "9vw" : 0, y: desktop ? 0 : "-15vh" });
            gsap.set("[data-photo='color']", { "--s": 1 });
            return;
          }

          const headline = SplitText.create("[data-headline]", { type: "lines", mask: "lines", linesClass: "pb-[0.06em]" });
          const intro = SplitText.create("[data-intro]", { type: "lines", mask: "lines" });
          const wordmark = SplitText.create("[data-wordmark]", { type: "chars" });

          // Torna tudo visível antes de criar os "from", que então aplicam o estado inicial na hora.
          gsap.set("[data-reveal]", { autoAlpha: 1 });

          // ── Abertura (no carregamento): só a foto e o convite para rolar ──
          gsap
            .timeline({ defaults: { ease: "expo.out" } })
            .fromTo(
              "[data-frame]",
              { clipPath: "inset(18% 26% 18% 26% round 220px)" },
              { clipPath: "inset(0% 0% 0% 0% round var(--frame-radius))", duration: 1.6, ease: "expo.inOut", clearProps: "clipPath" },
            )
            .fromTo(
              "[data-photo-wrap]",
              { scale: 1.3, filter: "brightness(0.4) blur(8px)" },
              { scale: 1, filter: "brightness(1) blur(0px)", duration: 2, ease: "expo.inOut", clearProps: "filter" },
              0,
            )
            .from("[data-cue-item]", { autoAlpha: 0, y: 24, stagger: 0.12, duration: 1.2 }, 1.2);

          // ── Scroll: aproxima do rosto, colore e revela um elemento por vez ──
          const tl = gsap.timeline({
            defaults: { ease: "power3.out", duration: 1 },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: desktop ? "+=340%" : "+=280%",
              pin: true,
              scrub: 1,
              anticipatePin: 1,
            },
          });

          tl.to("[data-cue]", { autoAlpha: 0, y: 24, duration: 0.6, ease: "power1.in" }, 0)
            .to(
              "[data-stage]",
              { scale: desktop ? 1.55 : 1.2, x: desktop ? "9vw" : 0, y: desktop ? 0 : "-15vh", duration: 4, ease: "power2.inOut" },
              0,
            )
            .to("[data-photo='color']", { "--s": 1, duration: 3, ease: "power1.inOut" }, 1)
            .to("[data-shade]", { autoAlpha: 1, duration: 2, ease: "none" }, 2.6)
            // Cada item entra depois do anterior
            .from("[data-reveal='nav']", { y: -24, autoAlpha: 0, stagger: 0.5 }, 4)
            .from("[data-eyebrow]", { y: 12, autoAlpha: 0 }, ">-0.2")
            .from(headline.lines, { yPercent: 110, stagger: 0.4, duration: 1.2 }, ">-0.3")
            // Recorte (e não deslocamento) para não tirar as palavras rotativas da máscara
            .fromTo("[data-word-line]", { clipPath: "inset(0% 0% 100% 0%)", y: 60 }, { clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 1.2 }, ">-0.4")
            .from(intro.lines, { yPercent: 100, autoAlpha: 0, stagger: 0.25 }, ">-0.2")
            .from("[data-cta]", { y: 24, autoAlpha: 0, stagger: 0.4 }, ">-0.2")
            .from("[data-card='services']", { y: 32, autoAlpha: 0 }, ">-0.2")
            .from("[data-service]", { x: 24, autoAlpha: 0, stagger: 0.35 }, ">-0.5")
            .from("[data-social]", { y: 16, autoAlpha: 0, stagger: 0.15 }, ">-0.2")
            .from("[data-card='status']", { y: 32, autoAlpha: 0 }, ">-0.3")
            .from(wordmark.chars, { yPercent: 100, stagger: 0.08, duration: 1.4 }, ">-0.3")
            .from("[data-scroll-cue]", { autoAlpha: 0, y: 10 }, ">-0.4")
            .to({}, { duration: 1 }); // respiro no fim antes de soltar a seção

          // ── Palavra rotativa (roda sempre; aparece quando o título é revelado) ──
          const items = gsap.utils.toArray<HTMLElement>("[data-word]");
          const hold = 2.4;
          gsap.set(items.slice(1), { yPercent: 110 });
          const rotate = gsap.timeline({ repeat: -1 });
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
            gsap.set("[data-light]", { xPercent: -50, yPercent: -50, x: frame.offsetWidth * 0.55, y: frame.offsetHeight * 0.35 });

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
      <div data-frame className="relative h-full overflow-hidden rounded-[var(--frame-radius)] bg-ink [container-type:size]">
        {/* ── Fundo: foto P&B, cópia colorida revelada no rosto, luz, sombras e granulação ── */}
        <div data-photo-wrap className="absolute inset-0">
          {/* O wrapper centraliza com translate do CSS; o GSAP só mexe no data-stage de dentro */}
          <div className="absolute top-1/2 left-1/2 aspect-[1672/941] w-[max(106cqw,calc(106cqh*1672/941))] -translate-x-1/2 -translate-y-1/2">
            <div data-stage className="absolute inset-0" style={{ transformOrigin: `${FACE.x} ${FACE.y}` }}>
              <Photo />
              <Photo color />
            </div>
          </div>
        </div>

        <div
          data-light
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 hidden size-[620px] rounded-full mix-blend-soft-light [background:radial-gradient(circle,rgb(255_138_99/0.55),rgb(255_90_44/0.12)_40%,transparent_68%)] [@media(hover:hover)]:block"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgb(9_9_10/0.6)_100%)]" />
        <div data-shade aria-hidden="true" className="pointer-events-none invisible absolute inset-0 opacity-0">
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(9_9_10/0.88)_0%,rgb(9_9_10/0.35)_38%,transparent_60%,rgb(9_9_10/0.45)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(9_9_10/0.55)_0%,transparent_22%,transparent_55%,rgb(9_9_10/0.92)_100%)]" />
        </div>
        <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-[0.22]" />

        {/* ── Nome gigante ao fundo ── */}
        <div data-wordmark-wrap aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
          <p
            data-wordmark
            data-reveal
            className="display translate-y-[22%] text-[19vw] leading-[0.8] font-semibold whitespace-nowrap text-bone/[0.06] uppercase md:text-[17.5vw]"
          >
            Cassiano
          </p>
        </div>

        <Navbar />

        {/* ── Convite para rolar (único elemento visível no início) ── */}
        {/* Some assim que a rolagem começa; deixa claro que o site carregou e que há algo a descobrir */}
        <div data-cue className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between text-bone">
          <div className="flex items-center justify-between px-5 pt-5 md:px-8 md:pt-6">
            <span data-cue-item className="flex h-9 items-center">
              <Logo className="h-5 w-auto text-bone md:h-[22px]" />
            </span>
            <span data-cue-item className="eyebrow hidden text-bone/70 sm:block">
              Portfólio ©2026
            </span>
          </div>

          <div className="flex flex-col items-center bg-[linear-gradient(180deg,transparent,rgb(9_9_10/0.85)_55%)] px-5 pt-32 pb-8 text-center md:pb-10">
            <p data-cue-item className="eyebrow mb-4 flex items-center gap-3 text-bone/70">
              <span className="size-1.5 rounded-full bg-ember" />
              Design Developer
            </p>
            <p data-cue-item className="max-w-[360px] text-base text-bone/80">
              Role a página para ver meus projetos.
            </p>
            <button
              data-cue-item
              type="button"
              onClick={() => scrollToY(window.innerHeight * 2.2)}
              className="group pointer-events-auto mt-8 flex flex-col items-center gap-3 rounded-full px-6 py-2 text-bone/90 transition-colors hover:text-bone"
            >
              <span className="relative hidden h-12 w-7 rounded-full border-[1.5px] border-bone/60 transition-colors group-hover:border-ember [@media(pointer:fine)]:block" aria-hidden="true">
                <span className="absolute top-2.5 left-1/2 h-2.5 w-[3px] -translate-x-1/2 animate-[wheel_1.8s_cubic-bezier(0.65,0,0.35,1)_infinite] rounded-full bg-ember" />
              </span>
              <span className="relative h-12 w-px overflow-hidden bg-bone/20 [@media(pointer:fine)]:hidden" aria-hidden="true">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2s_cubic-bezier(0.65,0,0.35,1)_infinite] bg-ember" />
              </span>
              <span className="eyebrow">Começar</span>
            </button>
          </div>
        </div>

        {/* ── Conteúdo principal ── */}
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pt-28 pb-24 md:justify-center md:px-10 md:pb-28 lg:px-14">
          <div className="max-w-[640px]">
            <div data-eyebrow data-reveal className="eyebrow mb-6 flex items-center gap-3 text-mute">
              <span className="size-1.5 rounded-full bg-ember" />
              <span className="whitespace-nowrap">Design Developer</span>
              <span className="h-px w-10 bg-bone/20" />
              <span className="whitespace-nowrap">©2026</span>
            </div>

            <h1 data-reveal className="display text-[clamp(52px,7.6vw,124px)] leading-[0.92]">
              <span data-headline className="block">
                Design que
              </span>
              <span className="relative block overflow-hidden pb-[0.08em]">
                <span className="sr-only">encanta, converte, se move, permanece.</span>
                <span data-word-line aria-hidden="true" className="grid text-mute">
                  {words.map((w) => (
                    <span key={w} data-word className="col-start-1 row-start-1 whitespace-nowrap">
                      {w.slice(0, -1)}
                      <span className="text-ember">.</span>
                    </span>
                  ))}
                </span>
              </span>
            </h1>

            <p data-intro data-reveal className="mt-8 max-w-[440px] text-base leading-relaxed text-bone/70 md:text-[17px]">
              Sou JP Cassiano, design developer. Desenho sites e produtos digitais e também escrevo o código, então o
              layout que você aprova é o mesmo que vai para o ar.
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
          data-card="services"
          data-reveal
          aria-label="O que eu faço"
          className="absolute top-28 right-10 z-10 hidden w-[300px] lg:block xl:right-14 xl:w-[320px]"
        >
          <p className="mb-3 flex items-center justify-between text-sm">
            <span>O que eu faço</span>
            <span className="eyebrow text-mute tabular-nums">03</span>
          </p>
          <ul className="flex flex-col gap-2">
            {services.map((s) => (
              <li key={s.n} data-service>
                <a
                  href="#processo"
                  className="glass group flex items-center gap-3 rounded-2xl p-2 pr-4 transition-colors duration-300 hover:border-bone/25 hover:bg-carbon/70"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-bone/[0.06] text-[13px] font-medium text-mute tabular-nums transition-colors duration-300 group-hover:bg-ember group-hover:text-ink">
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
            <p data-reveal data-social className="eyebrow hidden text-mute md:block">
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

          <div data-card="status" data-reveal className="glass hidden w-[300px] rounded-2xl p-4 md:block xl:w-[320px]">
            <div className="flex items-center gap-2.5">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-live/70" />
                <span className="relative size-2 rounded-full bg-live" />
              </span>
              <span className="text-[13px]">Disponível para novos projetos</span>
            </div>
            <div className="mt-4 flex items-end justify-between border-t border-bone/10 pt-3">
              <div>
                <p className="eyebrow text-mute">Onde estou</p>
                <p className="mt-1 text-[13px] text-bone/85">Alfenas, MG</p>
              </div>
              <div className="text-right">
                <p className="eyebrow text-mute">Hora local</p>
                <p className="mt-1 text-[13px] text-bone/85 tabular-nums">{time} BRT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
