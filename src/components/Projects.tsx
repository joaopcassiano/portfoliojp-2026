import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { revealOnScroll } from "../lib/scrollFx";
import { useFontsReady } from "../hooks/useFontsReady";
import { projects, type Project } from "../data/projects";
import { ArrowIcon } from "./Navbar";
import Magnetic from "./Magnetic";

const pad = (n: number) => String(n).padStart(2, "0");

/** Moldura do print. Sem imagem, mostra um espaço reservado com o nome do projeto. */
function Mockup({ project }: { project: Project }) {
  return (
    <div className="glass relative h-full min-h-[220px] overflow-hidden rounded-[20px]">
      {project.image ? (
        <img src={project.image} alt={`Tela do projeto ${project.title}`} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-top" />
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
    </div>
  );
}

export default function Projects() {
  const root = useRef<HTMLElement>(null);
  const fontsReady = useFontsReady();

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
              <p data-project-text className="mt-4 max-w-[340px] text-[15px] leading-relaxed text-bone/70">
                {p.description}
              </p>
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
                <ul className="flex flex-wrap gap-2">
                  {[...p.tags, p.year].map((t) => (
                    <li key={t} className="glass rounded-full px-3.5 py-1.5 text-[13px] text-bone/80">
                      {t}
                    </li>
                  ))}
                </ul>
                <Magnetic strength={0.3}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Abrir ${p.title} no GitHub`}
                    className="group grid size-11 shrink-0 place-items-center rounded-full bg-bone text-ink transition-colors duration-300 hover:bg-ember"
                  >
                    <ArrowIcon className="size-4 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                  </a>
                </Magnetic>
              </div>
              <div className="min-h-0 flex-1">
                <Mockup project={p} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
