import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "../lib/gsap";
import { revealOnScroll } from "../lib/scrollFx";
import { useFontsReady } from "../hooks/useFontsReady";
import { steps, type ProcessStep } from "../data/process";
import { ArrowIcon } from "./Navbar";
import Magnetic from "./Magnetic";
import Stack from "./Stack";
import { scrollToY } from "../lib/lenis";

const pad = (n: number) => String(n).padStart(2, "0");

/** Mini-visual de cada etapa: um trecho de tela, de código ou de interface. */
function StepVisual({ kind }: { kind: ProcessStep["visual"] }) {
  switch (kind) {
    case "chat":
      return (
        <div className="flex h-full flex-col justify-center gap-3 p-5 text-[13px]">
          <p data-vis className="max-w-[80%] self-start rounded-2xl rounded-bl-md bg-bone/[0.07] px-4 py-2.5 text-bone/85">
            Qual é o objetivo do site?
          </p>
          <p data-vis className="max-w-[80%] self-end rounded-2xl rounded-br-md bg-ember/90 px-4 py-2.5 text-ink">
            Receber mais pedidos de orçamento.
          </p>
          <p data-vis className="flex gap-1 self-start rounded-2xl bg-bone/[0.07] px-4 py-3" aria-hidden="true">
            <span className="size-1.5 animate-bounce rounded-full bg-bone/60" />
            <span className="size-1.5 animate-bounce rounded-full bg-bone/60 [animation-delay:120ms]" />
            <span className="size-1.5 animate-bounce rounded-full bg-bone/60 [animation-delay:240ms]" />
          </p>
        </div>
      );
    case "wireframe":
      return (
        <div className="flex h-full flex-col gap-2.5 p-5" aria-hidden="true">
          <div data-vis className="flex items-center justify-between rounded-md border border-dashed border-bone/20 px-3 py-2">
            <span className="h-2 w-10 rounded-full bg-bone/25" />
            <span className="flex gap-1.5">
              <span className="h-2 w-6 rounded-full bg-bone/15" />
              <span className="h-2 w-6 rounded-full bg-bone/15" />
              <span className="h-2 w-6 rounded-full bg-ember/70" />
            </span>
          </div>
          <div data-vis className="flex flex-1 items-center gap-3 rounded-md border border-dashed border-bone/20 p-3">
            <span className="flex flex-1 flex-col gap-1.5">
              <span className="h-2.5 w-4/5 rounded-full bg-bone/30" />
              <span className="h-2.5 w-3/5 rounded-full bg-bone/30" />
              <span className="mt-1 h-2 w-2/5 rounded-full bg-bone/15" />
            </span>
            <span className="aspect-square h-full rounded-md bg-bone/[0.06]" />
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <span key={i} data-vis className="h-8 rounded-md border border-dashed border-bone/20" />
            ))}
          </div>
        </div>
      );
    case "code":
      return (
        <pre className="flex h-full flex-col justify-center overflow-hidden p-5 font-[ui-monospace,monospace] text-[12px] leading-6 md:text-[13px]">
          <code>
            <span data-vis className="block">
              <span className="text-mute">&lt;</span>
              <span className="text-ember">section</span> <span className="text-bone/60">class</span>
              <span className="text-mute">=</span>
              <span className="text-live">"hero"</span>
              <span className="text-mute">&gt;</span>
            </span>
            <span data-vis className="block pl-4">
              <span className="text-mute">&lt;</span>
              <span className="text-ember">h1</span>
              <span className="text-mute">&gt;</span>
              <span className="text-bone">Do layout ao código</span>
              <span className="text-mute">&lt;/</span>
              <span className="text-ember">h1</span>
              <span className="text-mute">&gt;</span>
            </span>
            <span data-vis className="block pl-4">
              <span className="text-mute">&lt;</span>
              <span className="text-ember">a</span> <span className="text-bone/60">href</span>
              <span className="text-mute">=</span>
              <span className="text-live">"#contato"</span>
              <span className="text-mute">&gt;</span>
              <span className="text-bone">Vamos conversar</span>
              <span className="text-mute">&lt;/</span>
              <span className="text-ember">a</span>
              <span className="text-mute">&gt;</span>
            </span>
            <span data-vis className="block">
              <span className="text-mute">&lt;/</span>
              <span className="text-ember">section</span>
              <span className="text-mute">&gt;</span>
            </span>
          </code>
        </pre>
      );
    case "motion":
      return (
        <div className="flex h-full flex-col justify-between gap-4 p-5">
          <code data-vis className="block font-[ui-monospace,monospace] text-[12px] text-bone/80 md:text-[13px]">
            <span className="text-ember">gsap</span>.<span className="text-live">from</span>(
            <span className="text-bone">".card"</span>, {"{"} y: <span className="text-ember">40</span>, stagger:{" "}
            <span className="text-ember">0.1</span> {"}"})
          </code>
          <div className="flex flex-1 items-end justify-center gap-3" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} data-motion-card className="h-14 w-10 rounded-lg bg-bone/[0.08] ring-1 ring-bone/15 md:h-16 md:w-12" />
            ))}
          </div>
        </div>
      );
    case "launch":
      return (
        <div className="flex h-full flex-col justify-center gap-4 p-5" aria-hidden="true">
          <div data-vis className="flex items-center gap-3 rounded-full bg-bone/[0.06] py-2 pr-2 pl-4">
            <span className="flex-1 truncate text-[13px] text-bone/70">seusite.com.br</span>
            <span className="flex items-center gap-1.5 rounded-full bg-live/15 px-3 py-1 text-[12px] text-live">
              <span className="size-1.5 rounded-full bg-live" />
              No ar
            </span>
          </div>
          <div className="flex items-center justify-center gap-6 text-bone/70">
            <span data-vis className="flex items-center gap-2 text-[13px]">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-5">
                <rect x="1.5" y="2.5" width="13" height="8.5" rx="1.5" />
                <path d="M5.5 14h5M8 11v3" strokeLinecap="round" />
              </svg>
              Desktop
              <span className="text-live">✓</span>
            </span>
            <span data-vis className="flex items-center gap-2 text-[13px]">
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" className="size-5">
                <rect x="4" y="1.5" width="8" height="13" rx="2" />
                <path d="M7 12.5h2" strokeLinecap="round" />
              </svg>
              Celular
              <span className="text-live">✓</span>
            </span>
          </div>
        </div>
      );
  }
}

/** Quanto de rolagem (em % da altura da tela) cada etapa ocupa enquanto a área está presa. */
const SCROLL_PER_STEP = 60;

export default function Process() {
  const root = useRef<HTMLElement>(null);
  const visuals = useRef<HTMLDivElement>(null);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);
  const pin = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);
  const fontsReady = useFontsReady();

  const [active, setActive] = useState(0);
  // Lido depois de montar, para o HTML gerado no build ser igual ao primeiro render no navegador
  const [reduced, setReduced] = useState(false);
  useEffect(() => setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches), []);

  useGSAP(
    () => {
      if (!fontsReady) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        revealOnScroll("[data-process-label]", "[data-process-head]", { x: -80, autoAlpha: 0 });
        revealOnScroll("[data-process-count]", "[data-process-head]", { x: 80, autoAlpha: 0 });
        revealOnScroll("[data-process-line]", "[data-process-head]", { scaleX: 0 }, { duration: 1.6 });
        revealOnScroll("[data-process-title] > *", "[data-process-title]", { y: 60, autoAlpha: 0 }, { stagger: 0.12 });

        // Lista de etapas entra da esquerda; o quadro do visual sobe
        revealOnScroll("[data-step]", "[data-process-steps]", { x: -80, autoAlpha: 0 }, { stagger: 0.08 });
        revealOnScroll(
          "[data-step-card]",
          "[data-process-steps]",
          { y: 80, rotationX: -15, autoAlpha: 0, transformOrigin: "50% 100%" },
          { delay: 0.15, duration: 1.4 },
        );

        // A área das etapas fica presa enquanto a pessoa rola; cada trecho da rolagem abre uma etapa
        // e a barrinha da etapa aberta mostra quanto falta para a próxima.
        pin.current = ScrollTrigger.create({
          trigger: "[data-process-steps]",
          start: () => (window.innerWidth < 1024 ? "top top+=24" : "center center"),
          end: () => `+=${(steps.length * SCROLL_PER_STEP * window.innerHeight) / 100}`,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const pos = self.progress * steps.length;
            const index = Math.min(steps.length - 1, Math.floor(pos));
            if (index !== activeRef.current) {
              activeRef.current = index;
              setActive(index);
            }
            bars.current.forEach((bar, i) => {
              if (bar) gsap.set(bar, { scaleX: i === index ? Math.min(1, pos - index) : i < index ? 1 : 0 });
            });
          },
        });

        // Os cartões do visual de motion sobem em sequência sem parar, como uma animação de verdade.
        // Só rodam enquanto estão na tela.
        gsap.to("[data-motion-card]", {
          y: -18,
          backgroundColor: "rgb(255 90 44 / 0.85)",
          duration: 0.5,
          ease: "power2.out",
          stagger: { each: 0.12, repeat: -1, yoyo: true, repeatDelay: 0.6 },
          scrollTrigger: { trigger: "[data-step-card]", start: "top bottom", end: "bottom top", toggleActions: "play pause resume pause" },
        });

        revealOnScroll("[data-process-end] > *", "[data-process-end]", { y: 50, autoAlpha: 0 }, { stagger: 0.12 });

        return () => {
          pin.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [fontsReady] },
  );

  // Clique numa etapa: com a área presa, rola até o trecho dela; sem animação, só abre a etapa
  const goTo = (i: number) => {
    const st = pin.current;
    if (!st) {
      activeRef.current = i;
      setActive(i);
      return;
    }
    scrollToY(st.start + ((i + 0.05) / steps.length) * (st.end - st.start), 1.2);
  };

  // Troca do visual: o anterior sai para cima, o novo sobe e monta seus elementos
  useEffect(() => {
    const layers = visuals.current?.querySelectorAll<HTMLElement>("[data-visual]");
    if (!layers) return;
    layers.forEach((layer, i) => {
      gsap.killTweensOf(layer);
      if (i === active) {
        if (reduced) {
          gsap.set(layer, { autoAlpha: 1, y: 0 });
          return;
        }
        gsap.fromTo(layer, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" });
        gsap.from(layer.querySelectorAll("[data-vis]"), { y: 14, autoAlpha: 0, stagger: 0.08, delay: 0.15, duration: 0.6, ease: "expo.out" });
      } else {
        gsap.to(layer, { autoAlpha: 0, y: -16, duration: reduced ? 0 : 0.35, ease: "power2.in" });
      }
    });
  }, [active, reduced]);

  return (
    <section
      id="processo"
      ref={root}
      aria-labelledby="processo-titulo"
      className="relative overflow-x-clip px-5 pt-24 pb-20 md:px-10 md:pt-32 md:pb-28 lg:px-14"
    >
      {/* ── Cabeçalho ── */}
      <div data-process-head className="relative flex items-end justify-between pb-5">
        <span data-process-line aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-bone/10" />
        <div data-process-label className="eyebrow flex items-center gap-3 text-mute">
          <span className="text-ember">(03)</span>
          <span className="h-px w-8 bg-bone/20" />
          <span>Processo</span>
        </div>
        <span data-process-count className="eyebrow text-mute tabular-nums">
          {pad(steps.length)} etapas
        </span>
      </div>

      <div data-process-title className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-12">
        <h2 id="processo-titulo" className="display text-[clamp(44px,6.4vw,104px)] lg:col-span-7">
          Do layout ao código
        </h2>
        <p className="max-w-[440px] self-end text-base leading-relaxed text-bone/70 md:text-[17px] lg:col-span-5 lg:justify-self-end">
          Eu desenho e programo o mesmo projeto, então o que você aprova no Figma é o que vai para o ar.
        </p>
      </div>

      {/* ── Etapas: lista compacta + um quadro de visual que troca com a etapa ── */}
      <div
        data-process-steps
        className="mt-10 grid gap-6 md:mt-14 lg:grid-cols-12 lg:gap-12"
      >
        <div className="[perspective:1200px] lg:order-2 lg:col-span-7">
          <div data-step-card className="glass relative h-64 overflow-hidden rounded-[24px] md:h-80 lg:h-full lg:min-h-[400px]">
            <span className="absolute top-5 left-6 text-sm text-mute tabular-nums">
              {pad(active + 1)} / {pad(steps.length)}
            </span>
            <div ref={visuals} className="absolute inset-0">
              {steps.map((s, i) => (
                <div
                  key={s.title}
                  data-visual
                  aria-hidden={i !== active}
                  className={`absolute inset-0 grid place-items-center px-5 ${i === 0 ? "" : "invisible opacity-0"}`}
                >
                  <div className="h-56 w-full max-w-[460px]">
                    <StepVisual kind={s.visual} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <ol className="divide-y divide-bone/10 border-y border-bone/10 lg:order-1 lg:col-span-5">
          {steps.map((s, i) => {
            const open = i === active;
            return (
              <li key={s.title} data-step>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-expanded={open}
                  aria-controls={`etapa-${i}`}
                  className="group flex w-full items-baseline gap-5 py-4 text-left md:py-5"
                >
                  <span
                    className={`w-8 shrink-0 text-xl tabular-nums transition-colors duration-500 md:w-10 md:text-2xl ${open ? "text-ember" : "text-mute group-hover:text-bone/70"}`}
                  >
                    {pad(i + 1)}
                  </span>
                  <h3
                    className={`heading text-2xl transition-colors duration-500 md:text-3xl ${open ? "text-bone" : "text-bone/45 group-hover:text-bone/80"}`}
                  >
                    {s.title}
                  </h3>
                </button>
                {/* Conteúdo da etapa: abre só na etapa ativa */}
                <div
                  id={`etapa-${i}`}
                  className={`grid transition-[grid-template-rows] duration-500 ease-out-expo ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5 pl-[3.25rem] md:pl-[3.75rem]">
                      <p className="max-w-[440px] text-[15px] leading-relaxed text-bone/70">{s.text}</p>
                      <p className="mt-4 flex items-start gap-3 text-sm">
                        <span className="mt-0.5 shrink-0 rounded-full border border-bone/15 px-2.5 py-0.5 text-[12px] text-mute">
                          Você recebe
                        </span>
                        <span className="text-bone/90">{s.delivers}</span>
                      </p>
                      {!reduced && (
                        <span aria-hidden="true" className="mt-5 block h-px w-full overflow-hidden bg-bone/10">
                          <span
                            ref={(el) => {
                              bars.current[i] = el;
                            }}
                            className="block h-full origin-left scale-x-0 bg-ember"
                          />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* ── Linguagens e ferramentas (o componente já traz o próprio espaçamento) ── */}
      <Stack />

      {/* ── Fechamento ── */}
      <div data-process-end className="mt-20 flex flex-col items-start gap-8 md:mt-28 md:flex-row md:items-end md:justify-between">
        <p className="display max-w-[760px] text-[clamp(36px,4.6vw,72px)]">
          Tem um projeto em mente? Me conta o que você precisa<span className="text-ember">.</span>
        </p>
        <Magnetic>
          <a
            href="#contato"
            className="group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-full bg-bone py-2 pr-2 pl-6 text-sm font-medium text-ink"
          >
            <span className="absolute inset-0 translate-y-full rounded-full bg-ember transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
            <span className="relative">Vamos conversar</span>
            <span className="relative grid size-9 place-items-center rounded-full bg-ink text-bone">
              <ArrowIcon className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
            </span>
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
