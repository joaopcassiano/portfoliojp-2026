import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { revealOnScroll } from "../lib/scrollFx";
import { useFontsReady } from "../hooks/useFontsReady";
import { projects, type Project } from "../data/projects";
import { ArrowIcon } from "./Navbar";
import Magnetic from "./Magnetic";
import VideoModal from "./VideoModal";

const pad = (n: number) => String(n).padStart(2, "0");

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={className}>
      <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" />
    </svg>
  );
}

/** Moldura do print. Sem imagem, mostra um espaço reservado com o nome do projeto. */
function Mockup({ project, onPlay }: { project: Project; onPlay: () => void }) {
  return (
    <div className="glass relative h-full min-h-[220px] overflow-hidden rounded-[20px]">
      {project.image ? (
        <div className="absolute inset-3 flex flex-col overflow-hidden rounded-[14px] bg-graphite md:inset-5">
          {/* Barra do navegador */}
          <div aria-hidden="true" className="flex h-8 shrink-0 items-center gap-3 border-b border-bone/10 px-3 md:h-9">
            <span className="flex gap-1.5">
              <span className="size-2 rounded-full bg-bone/20" />
              <span className="size-2 rounded-full bg-bone/20" />
              <span className="size-2 rounded-full bg-bone/20" />
            </span>
            {project.url && (
              <span className="truncate rounded-full bg-bone/[0.06] px-3 py-0.5 text-[11px] text-mute">
                {project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </span>
            )}
          </div>
          <img
            src={project.image}
            alt={`Página inicial do ${project.title} no computador`}
            loading="lazy"
            className="min-h-0 w-full flex-1 object-cover object-left-top"
          />
        </div>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div aria-hidden="true" className="absolute inset-0 [background:radial-gradient(60%_80%_at_70%_30%,rgb(255_90_44/0.16),transparent_70%)]" />
          <div aria-hidden="true" className="grain absolute inset-0 opacity-20" />
          <p className="display relative text-[clamp(40px,7vw,120px)] text-bone/[0.08]">{project.title}</p>
          <p className="eyebrow absolute bottom-5 left-5 flex items-center gap-2 text-mute">
            <span className="size-1.5 rounded-full bg-ember" />
            Print em breve
          </p>
        </div>
      )}

      {/* Miniatura do vídeo de apresentação, no canto oposto ao celular */}
      {project.video && (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Assistir ao vídeo de apresentação do ${project.title}`}
          className="group absolute bottom-[7%] left-[6%] w-[clamp(150px,30%,320px)] overflow-hidden rounded-2xl bg-black text-left shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-bone/15 transition-transform duration-700 ease-out-expo hover:-translate-y-1"
        >
          <img
            src={project.video.poster}
            alt=""
            loading="lazy"
            className="aspect-video w-full object-cover opacity-80 transition-[opacity,transform] duration-700 ease-out-expo group-hover:scale-105 group-hover:opacity-100"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-11 place-items-center rounded-full bg-ember text-ink shadow-[0_0_0_8px_rgb(255_90_44/0.18)] transition-transform duration-500 ease-out-expo group-hover:scale-110 md:size-14">
              <PlayIcon className="ml-0.5 size-4 md:size-5" />
            </span>
          </span>
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-2 text-[11px] text-bone/90 md:text-xs">
            <span>Apresentação</span>
            <span className="tabular-nums">{project.video.duration}</span>
          </span>
        </button>
      )}

      {/* Celular por cima do print desktop */}
      {project.mobileImage && (
        <div
          data-project-phone
          className="absolute right-[6%] bottom-[7%] w-[clamp(96px,19%,210px)] rounded-[26px] bg-black p-[5px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)] ring-1 ring-bone/15 transition-transform duration-700 ease-out-expo hover:-translate-y-2 md:rounded-[32px] md:p-[7px]"
        >
          <img
            src={project.mobileImage}
            alt={`Tela inicial do app ${project.title} no celular`}
            loading="lazy"
            className="aspect-[739/1600] w-full rounded-[21px] object-cover md:rounded-[26px]"
          />
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const fontsReady = useFontsReady();
  const [playing, setPlaying] = useState<Project | null>(null);
  const closeVideo = useCallback(() => setPlaying(null), []);

  useGSAP(
    () => {
      if (!fontsReady) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // ── Cabeçalho: rótulo, contador e linha entram ao chegar ──
        revealOnScroll("[data-projects-label]", "[data-projects-head]", { x: -80, autoAlpha: 0 });
        revealOnScroll("[data-projects-count]", "[data-projects-head]", { x: 80, autoAlpha: 0 });
        revealOnScroll("[data-projects-line]", "[data-projects-head]", { scaleX: 0 }, { duration: 1.6 });

        // ── Pilha: a área fica presa e cada projeto sobe por cima do anterior,
        //    que encolhe e escurece, como na referência ──
        const panels = gsap.utils.toArray<HTMLElement>("[data-project]");
        gsap.set(panels.slice(1), { yPercent: 100 });

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: "[data-projects-stage]",
            start: "top top",
            end: () => `+=${(panels.length - 1) * window.innerHeight}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
        panels.forEach((panel, i) => {
          if (i === 0) return;
          // O filtro precisa de valor inicial explícito: a partir de "none" o GSAP começaria do escuro
          tl.to(panel, { yPercent: 0 }, i - 1).fromTo(
            panels[i - 1],
            { scale: 1, filter: "brightness(1)" },
            { scale: 0.86, filter: "brightness(0.35)", transformOrigin: "50% 0%", immediateRender: false },
            i - 1,
          );
        });

        // O conteúdo do primeiro projeto entra sozinho quando a área chega na tela
        const first = panels[0];
        revealOnScroll(first.querySelectorAll("[data-project-text]"), "[data-projects-stage]", { x: -80, autoAlpha: 0 }, { stagger: 0.1, start: "top 75%" });
        revealOnScroll(first.querySelector("[data-project-media]"), "[data-projects-stage]", { y: 80, scale: 0.92, autoAlpha: 0 }, { start: "top 75%", duration: 1.5 });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [fontsReady] },
  );

  return (
    <section id="projetos" ref={root} aria-labelledby="projetos-titulo" className="relative pt-8 md:pt-12">
      {/* ── Cabeçalho ── */}
      <div data-projects-head className="relative mx-5 flex items-end justify-between pb-5 md:mx-10 lg:mx-14">
        <span data-projects-line aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-bone/10" />
        <div data-projects-label className="eyebrow flex items-center gap-3 text-mute">
          <span className="text-ember">(02)</span>
          <span className="h-px w-8 bg-bone/20" />
          <h2 id="projetos-titulo">Projetos</h2>
        </div>
        <span data-projects-count className="eyebrow text-mute tabular-nums">
          {pad(projects.length)}
        </span>
      </div>

      {/* ── Pilha de projetos (presa na tela durante o scroll) ── */}
      <div data-projects-stage className="relative h-svh min-h-[640px] overflow-hidden">
        {projects.map((p, i) => (
          <article
            key={p.title}
            data-project
            aria-label={p.title}
            className="absolute inset-0 grid grid-rows-[auto_1fr] gap-6 border-t border-bone/10 bg-ink px-5 pt-8 pb-6 md:px-10 md:pt-10 md:pb-10 lg:grid-cols-12 lg:grid-rows-1 lg:gap-8 lg:px-14"
            style={{ zIndex: i + 1 }}
          >
            {/* Texto */}
            <div className="flex flex-col lg:col-span-4">
              <h3 data-project-text className="heading text-[clamp(32px,3.6vw,56px)]">
                {p.title}
              </h3>
              <p data-project-text className="mt-4 max-w-[360px] text-[15px] leading-relaxed text-bone/70">
                {p.description}
              </p>
              {p.video && (
                <div data-project-text className="mt-6 hidden lg:block">
                  <button
                    type="button"
                    onClick={() => setPlaying(p)}
                    className="group flex items-center gap-3 rounded-full border border-bone/15 py-1.5 pr-5 pl-1.5 text-sm text-bone transition-colors duration-300 hover:border-ember/60"
                  >
                    <span className="grid size-9 place-items-center rounded-full bg-ember text-ink transition-transform duration-500 ease-out-expo group-hover:scale-110">
                      <PlayIcon className="ml-0.5 size-3.5" />
                    </span>
                    Assistir apresentação
                    <span className="text-mute tabular-nums">{p.video.duration}</span>
                  </button>
                </div>
              )}
              <div data-project-text className="mt-auto hidden items-center justify-between pt-8 lg:flex">
                <span className="eyebrow text-mute">{p.category}</span>
                <span className="eyebrow text-mute tabular-nums">
                  {pad(i + 1)} / {pad(projects.length)}
                </span>
              </div>
            </div>

            {/* Tags + print */}
            <div data-project-media className="flex min-h-0 flex-col gap-4 lg:col-span-8">
              <div className="flex items-center justify-between gap-4">
                {p.stack ? (
                  // Tecnologias agrupadas por parte do projeto (ex.: Site | App)
                  <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    {p.stack.map((g, gi) => (
                      <li key={g.label} className="flex flex-wrap items-center gap-2">
                        {gi > 0 && <span aria-hidden="true" className="mr-2 hidden h-5 w-px bg-bone/15 sm:block" />}
                        <span className="eyebrow mr-0.5 text-mute">{g.label}</span>
                        {g.items.map((t) => (
                          <span key={t} className="glass rounded-full px-3.5 py-1.5 text-[13px] text-bone/80">
                            {t}
                          </span>
                        ))}
                      </li>
                    ))}
                    <li className="glass rounded-full px-3.5 py-1.5 text-[13px] text-bone/80">{p.year}</li>
                  </ul>
                ) : (
                  <ul className="flex flex-wrap gap-2">
                    {[...p.tags, p.year].map((t) => (
                      <li key={t} className="glass rounded-full px-3.5 py-1.5 text-[13px] text-bone/80">
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                <Magnetic strength={0.3}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir ${p.title}`}
                    className="group grid size-11 shrink-0 place-items-center rounded-full bg-bone text-ink transition-colors duration-300 hover:bg-ember"
                  >
                    <ArrowIcon className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                  </a>
                </Magnetic>
              </div>
              <div className="min-h-0 flex-1">
                <Mockup project={p} onPlay={() => setPlaying(p)} />
              </div>
            </div>
          </article>
        ))}
      </div>

      {playing?.video && (
        <VideoModal open onClose={closeVideo} src={playing.video.src} poster={playing.video.poster} title={playing.title} />
      )}
    </section>
  );
}
