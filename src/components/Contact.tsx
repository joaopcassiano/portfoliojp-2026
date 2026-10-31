import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import { revealOnScroll } from "../lib/scrollFx";
import { useFontsReady } from "../hooks/useFontsReady";
import { useLocalTime } from "../hooks/useLocalTime";
import { socials } from "./SocialLinks";
import { ArrowIcon } from "./Navbar";
import Magnetic from "./Magnetic";

const EMAIL = "dev.jpcassiano@gmail.com";
// Coloque o arquivo em public/curriculo.pdf: o botão de download se ativa sozinho quando ele existir.
const CV_URL = `${import.meta.env.BASE_URL}curriculo.pdf`;
const CV_FILENAME = "Curriculo-JP-Cassiano.pdf";

/** Confere se o PDF do currículo já foi colocado no site. */
function useCvAvailable() {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(CV_URL, { method: "HEAD", signal: ctrl.signal })
      .then((r) => setAvailable(r.ok && (r.headers.get("content-type") ?? "").includes("pdf")))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  return available;
}

/** Miniatura de uma folha de currículo, desenhada em HTML. */
function CvSheet() {
  const bar = (w: string, key: number) => <span key={key} className={`block h-1.5 rounded-full bg-ink/15 ${w}`} />;
  return (
    <div aria-hidden="true" className="aspect-[1/1.414] w-full rounded-xl bg-bone p-5 text-ink shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)] md:p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[13px] leading-tight font-semibold md:text-base">João Pedro Pereira Cassiano</p>
          <p className="mt-0.5 text-[10px] text-ink/60 md:text-xs">Design Developer · Alfenas, MG</p>
        </div>
        <span className="mt-1 size-2.5 shrink-0 rounded-full bg-ember" />
      </div>
      <span className="mt-4 block h-px bg-ink/15" />
      {[
        { t: "Experiência", rows: ["w-11/12", "w-4/5", "w-3/4"] },
        { t: "Formação", rows: ["w-5/6", "w-2/3"] },
        { t: "Projetos", rows: ["w-full", "w-4/5", "w-11/12"] },
        { t: "Stack", rows: ["w-3/4"] },
      ].map((s) => (
        <div key={s.t} className="mt-4 md:mt-5">
          <p className="text-[9px] font-semibold tracking-wide text-ink/50 uppercase md:text-[10px]">{s.t}</p>
          <div className="mt-2 space-y-1.5">{s.rows.map((w, i) => bar(w, i))}</div>
        </div>
      ))}
    </div>
  );
}

export default function Contact() {
  const root = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDivElement>(null);
  const fontsReady = useFontsReady();
  const time = useLocalTime();
  const cvAvailable = useCvAvailable();
  const [copied, setCopied] = useState(false);

  useGSAP(
    (_, contextSafe) => {
      if (!fontsReady) return;
      const mm = gsap.matchMedia();
      mm.add(
        { motion: "(prefers-reduced-motion: no-preference)", fine: "(hover: hover) and (pointer: fine)" },
        (ctx) => {
          const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
          if (!motion) return;
          revealOnScroll("[data-contact-label]", "[data-contact-head]", { x: -80, autoAlpha: 0 });
          revealOnScroll("[data-contact-step]", "[data-contact-head]", { x: 80, autoAlpha: 0 });
          revealOnScroll("[data-contact-line]", "[data-contact-head]", { scaleX: 0 }, { duration: 1.6 });

          // Título sobe linha por linha, por trás da própria máscara
          const title = SplitText.create("[data-contact-title]", { type: "lines", mask: "lines" });
          revealOnScroll(title.lines, "[data-contact-title]", { yPercent: 110 }, { stagger: 0.1, duration: 1.4 });
          revealOnScroll("[data-contact-intro]", "[data-contact-title]", { y: 30, autoAlpha: 0 }, { delay: 0.3 });

          // Canais diretos entram da esquerda; o bloco do currículo gira de leve vindo da direita
          revealOnScroll("[data-contact-channel]", "[data-contact-channels]", { x: -60, autoAlpha: 0 }, { stagger: 0.08 });
          revealOnScroll(
            "[data-cv-card]",
            "[data-cv-card]",
            { x: 120, rotationY: -18, autoAlpha: 0, transformOrigin: "100% 50%" },
            { duration: 1.5 },
          );
          // A folha cai na mesa, girada, e se ajeita
          revealOnScroll("[data-cv-sheet]", "[data-cv-card]", { y: 140, rotation: 14, autoAlpha: 0 }, { delay: 0.35, duration: 1.6 });
          revealOnScroll("[data-cv-text] > *", "[data-cv-card]", { y: 24, autoAlpha: 0 }, { stagger: 0.08, delay: 0.5 });

          // No desktop, a folha inclina em 3D seguindo o mouse
          if (fine && sheet.current) {
            const el = sheet.current;
            const card = el.closest<HTMLElement>("[data-cv-card]")!;
            const rx = gsap.quickTo(el, "rotationX", { duration: 0.8, ease: "power3.out" });
            const ry = gsap.quickTo(el, "rotationY", { duration: 0.8, ease: "power3.out" });
            const onMove = contextSafe!((e: PointerEvent) => {
              const r = card.getBoundingClientRect();
              ry(((e.clientX - r.left) / r.width - 0.5) * 16);
              rx(-((e.clientY - r.top) / r.height - 0.5) * 12);
            });
            const onLeave = contextSafe!(() => {
              rx(0);
              ry(0);
            });
            card.addEventListener("pointermove", onMove);
            card.addEventListener("pointerleave", onLeave);
            return () => {
              card.removeEventListener("pointermove", onMove);
              card.removeEventListener("pointerleave", onLeave);
            };
          }
        },
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [fontsReady] },
  );

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const channels = socials.filter((s) => !s.href.startsWith("mailto"));

  return (
    <section
      id="contato"
      ref={root}
      aria-labelledby="contato-titulo"
      className="relative overflow-x-clip px-5 pt-24 pb-24 md:px-10 md:pt-32 md:pb-32 lg:px-14"
    >
      {/* Brilho em brasa no fundo, vindo do canto do currículo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 size-[60vw] max-w-[900px] translate-x-1/3 translate-y-1/3 rounded-full [background:radial-gradient(circle,rgb(255_90_44/0.14),transparent_65%)]"
      />

      {/* ── Cabeçalho ── */}
      <div data-contact-head className="relative flex items-end justify-between pb-5">
        <span data-contact-line aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-bone/10" />
        <div data-contact-label className="eyebrow flex items-center gap-3 text-mute">
          <span className="text-ember">(04)</span>
          <span className="h-px w-8 bg-bone/20" />
          <span>Contato</span>
        </div>
        <span data-contact-step className="eyebrow text-mute">
          Etapa 01 · Entender
        </span>
      </div>

      <div className="relative mt-10 grid gap-12 md:mt-14 lg:grid-cols-12 lg:gap-12">
        {/* ── Coluna da esquerda: convite + canais diretos ── */}
        <div className="flex flex-col lg:col-span-6">
          <h2 id="contato-titulo" data-contact-title className="display text-[clamp(44px,5.6vw,92px)]">
            Todo projeto começa numa conversa<span className="text-ember">.</span>
          </h2>
          <p data-contact-intro className="mt-6 max-w-[440px] text-base leading-relaxed text-bone/70 md:text-[17px]">
            É a primeira etapa do meu processo. Me conta o que você precisa e o prazo que tem em mente, e eu respondo com os
            próximos passos.
          </p>

          <ul data-contact-channels className="mt-10 divide-y divide-bone/10 border-y border-bone/10 lg:mt-auto">
            <li data-contact-channel className="flex items-center justify-between gap-4 py-4">
              <a href={`mailto:${EMAIL}`} className="group min-w-0">
                <span className="block text-[13px] text-mute">E-mail</span>
                <span className="block truncate text-lg text-bone transition-colors group-hover:text-ember md:text-xl">{EMAIL}</span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="shrink-0 rounded-full border border-bone/15 px-4 py-2.5 text-sm text-bone/80 transition-colors hover:border-bone/40 hover:text-bone"
              >
                {copied ? "Copiado" : "Copiar"}
              </button>
            </li>
            {channels.map((c) => (
              <li data-contact-channel key={c.label}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-4 py-4 text-bone/85 transition-colors hover:text-bone"
                >
                  <span className="text-lg md:text-xl">{c.label}</span>
                  <span className="grid size-10 place-items-center rounded-full border border-bone/15 transition-colors duration-300 group-hover:border-ember group-hover:bg-ember group-hover:text-ink">
                    <ArrowIcon className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <p data-contact-channel className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-mute">
            <span className="flex items-center gap-2 text-bone/85">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-live/70" />
                <span className="relative size-2 rounded-full bg-live" />
              </span>
              Disponível para novos projetos
            </span>
            <span aria-hidden="true" className="hidden sm:inline">
              ·
            </span>
            <span>
              Alfenas, MG, agora são <span className="tabular-nums">{time}</span>
            </span>
          </p>
        </div>

        {/* ── Coluna da direita: currículo para baixar ── */}
        <div className="[perspective:1400px] lg:col-span-6">
          <div data-cv-card className="glass relative grid gap-8 overflow-hidden rounded-[28px] p-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] md:p-10">
            <div className="[perspective:1000px]">
              <div data-cv-sheet>
                <div ref={sheet} className="will-change-transform [transform-style:preserve-3d]">
                  <CvSheet />
                </div>
              </div>
            </div>

            <div data-cv-text className="flex flex-col justify-center">
              <p className="eyebrow text-mute">Currículo</p>
              <h3 className="heading mt-2 text-3xl md:text-4xl">Tudo numa página só</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-bone/70">
                Formação, experiência, projetos e as ferramentas que uso, em PDF, para você salvar ou mandar para o seu time.
              </p>
              <div className="mt-8">
                {cvAvailable ? (
                  <Magnetic>
                    <a
                      href={CV_URL}
                      download={CV_FILENAME}
                      className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-bone py-2 pr-2 pl-6 text-sm font-medium text-ink"
                    >
                      <span className="absolute inset-0 translate-y-full rounded-full bg-ember transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                      <span className="relative">Baixar currículo</span>
                      <span className="relative grid size-9 place-items-center rounded-full bg-ink text-bone">
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:translate-y-0.5">
                          <path d="M8 3v9M3.5 8.5 8 13l4.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </a>
                  </Magnetic>
                ) : (
                  <span
                    aria-disabled="true"
                    className="inline-flex cursor-not-allowed items-center gap-3 rounded-full border border-bone/15 py-3.5 pr-5 pl-6 text-sm text-bone/50"
                  >
                    Currículo em breve
                  </span>
                )}
                <p className="mt-3 text-[13px] text-mute">PDF · atualizado em 2026</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
