import { useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";
import { revealOnScroll } from "../lib/scrollFx";
import { trajectory, trajectoryEnd } from "../data/trajectory";

/** Linha do tempo dentro da seção Sobre: trabalho, formação, eventos e projetos, terminando em 2026. */
export default function Trajectory() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Montado antes do pin da hero: estes gatilhos são medidos depois dele
        const opts = { refreshPriority: -1 };

        revealOnScroll("[data-traj-head] h3", "[data-traj-head]", { x: -100, autoAlpha: 0 }, opts);
        revealOnScroll("[data-traj-line]", "[data-traj-head]", { scaleX: 0 }, { ...opts, duration: 1.6 });

        // A linha vertical se preenche em brasa conforme a pessoa desce (só decorativa)
        gsap.fromTo(
          "[data-traj-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-traj-list]", start: "top 70%", end: "bottom 70%", scrub: true, refreshPriority: -1 },
          },
        );

        gsap.utils.toArray<HTMLElement>("[data-traj-group]").forEach((group) => {
          revealOnScroll(group.querySelectorAll("[data-traj-label]"), group, { x: -60, autoAlpha: 0 }, { ...opts, stagger: 0.1 });
          revealOnScroll(group.querySelectorAll("[data-traj-item]"), group, { x: 80, autoAlpha: 0 }, { ...opts, stagger: 0.12, delay: 0.15 });
          revealOnScroll(
            group.querySelectorAll("[data-traj-card]"),
            group,
            { y: 80, rotationX: -25, autoAlpha: 0, transformOrigin: "50% 100%" },
            { ...opts, stagger: 0.15, delay: 0.15, duration: 1.4 },
          );
          revealOnScroll(group.querySelectorAll("[data-traj-dot]"), group, { scale: 0 }, { ...opts, stagger: 0.12, ease: "back.out(3)", duration: 0.8 });
        });

        revealOnScroll("[data-traj-end] > *", "[data-traj-end]", { y: 60, autoAlpha: 0 }, { ...opts, stagger: 0.12, start: "top 90%" });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mt-24 md:mt-36">
      <div data-traj-head className="relative flex items-end justify-between pb-5">
        <span data-traj-line aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-bone/10" />
        <h3 className="eyebrow text-mute">Trajetória</h3>
      </div>

      <div data-traj-list className="relative mt-10 md:mt-14">
        {/* Linha vertical: base apagada e preenchimento que acompanha o scroll */}
        <span aria-hidden="true" className="absolute top-2 bottom-0 left-[5px] w-px bg-bone/10 lg:left-[calc(25%+5px)]" />
        <span
          data-traj-progress
          aria-hidden="true"
          className="absolute top-2 bottom-0 left-[5px] w-px origin-top bg-ember lg:left-[calc(25%+5px)]"
        />

        <ol className="flex flex-col gap-14 md:gap-20">
          {trajectory.map((g) => {
            const featured = g.items.some((it) => it.featured);
            return (
              <li key={g.label} data-traj-group className="relative grid gap-6 lg:grid-cols-4 lg:gap-0">
                {/* Rótulo do grupo */}
                <div className="pl-8 lg:pr-10 lg:pl-0">
                  <p data-traj-label className="heading text-2xl md:text-3xl">
                    {g.label}
                  </p>
                  {g.intro && (
                    <p data-traj-label className="mt-3 max-w-[320px] text-sm leading-relaxed text-bone/65">
                      {g.intro}
                    </p>
                  )}
                </div>

                {/* Itens do grupo */}
                <div className="relative pl-8 lg:col-span-3 lg:pl-12">
                  {featured ? (
                    <ul className="grid gap-3 [perspective:1200px] md:grid-cols-3">
                      {g.items.map((it) => (
                        <li
                          key={it.title}
                          data-traj-card
                          className="glass group relative flex flex-col overflow-hidden rounded-[20px] p-6 transition-colors duration-500 hover:border-ember/40"
                        >
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-ember/0 blur-3xl transition-colors duration-700 group-hover:bg-ember/20"
                          />
                          <h4 className="heading relative text-xl md:text-2xl">{it.title}</h4>
                          {it.text && <p className="relative mt-3 text-sm leading-relaxed text-bone/70">{it.text}</p>}
                          {it.tags && (
                            <p className="relative mt-auto flex flex-wrap pt-6 text-[13px] text-mute">
                              {it.tags.map((t, ti) => (
                                <span key={t} className="whitespace-nowrap">
                                  {ti > 0 && <span aria-hidden="true" className="mx-1.5 text-mute/60">·</span>}
                                  {t}
                                </span>
                              ))}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="flex flex-col divide-y divide-bone/10">
                      {g.items.map((it) => (
                        <li
                          key={it.title + (it.place ?? "")}
                          data-traj-item
                          className="grid gap-1 py-4 first:pt-0 sm:grid-cols-[180px_1fr] sm:gap-6"
                        >
                          <span className="text-sm text-mute tabular-nums">{it.when ?? ""}</span>
                          <span>
                            <span className="block text-[17px] text-bone">{it.title}</span>
                            {it.place && <span className="mt-0.5 block text-sm text-bone/60">{it.place}</span>}
                            {it.text && <span className="mt-1 block text-sm text-bone/60">{it.text}</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Marcador do grupo na linha */}
                <span
                  data-traj-dot
                  aria-hidden="true"
                  className="absolute top-2.5 left-0 size-[11px] rounded-full border-2 border-ink bg-ember lg:left-[25%]"
                />
              </li>
            );
          })}
        </ol>

        {/* Último marco */}
        <div data-traj-end className="relative mt-16 pl-8 md:mt-24 lg:ml-[25%] lg:pl-12">
          <span aria-hidden="true" className="absolute top-3 left-0 grid size-[11px] place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-ember/60" />
            <span className="relative size-[11px] rounded-full bg-ember" />
          </span>
          <p className="display text-[clamp(56px,9vw,140px)] tabular-nums">{trajectoryEnd.when}</p>
          <p className="heading mt-2 text-2xl text-bone/80 md:text-3xl">{trajectoryEnd.title}</p>
        </div>
      </div>
    </div>
  );
}
