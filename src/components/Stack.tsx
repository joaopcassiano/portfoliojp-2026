import { useRef } from "react";
import {
  siC,
  siCplusplus,
  siCss,
  siDotnet,
  siGit,
  siGsap,
  siHtml5,
  siJavascript,
  siMysql,
  siOpenjdk,
  siPython,
  siReact,
  siTailwindcss,
  siTypescript,
  siVite,
} from "simple-icons";
import { gsap, useGSAP } from "../lib/gsap";

// C# e SQL Server não estão no simple-icons: o primeiro vira texto, o segundo um cilindro genérico
const DATABASE =
  "M12 3c-4.4 0-8 1.3-8 3v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0-1.7-3.6-3-8-3Zm0 2c3.6 0 6 .9 6 1s-2.4 1-6 1-6-.9-6-1 2.4-1 6-1ZM6 9.2c1.5.5 3.6.8 6 .8s4.5-.3 6-.8V12c0 .1-2.4 1-6 1s-6-.9-6-1V9.2Zm0 6c1.5.5 3.6.8 6 .8s4.5-.3 6-.8V18c0 .1-2.4 1-6 1s-6-.9-6-1v-2.8Z";

type Item = { name: string; path?: string; glyph?: string };

const groups: { title: string; items: Item[] }[] = [
  {
    title: "Front-end",
    items: [
      { name: "HTML", path: siHtml5.path },
      { name: "CSS", path: siCss.path },
      { name: "JavaScript", path: siJavascript.path },
      { name: "TypeScript", path: siTypescript.path },
      { name: "React", path: siReact.path },
      { name: "Tailwind CSS", path: siTailwindcss.path },
      { name: "GSAP", path: siGsap.path },
    ],
  },
  {
    title: "Back-end",
    items: [
      { name: "C#", glyph: "C#" },
      { name: ".NET", path: siDotnet.path },
      { name: "Java", path: siOpenjdk.path },
      { name: "Python", path: siPython.path },
      { name: "C", path: siC.path },
      { name: "C++", path: siCplusplus.path },
    ],
  },
  {
    title: "Dados e ferramentas",
    items: [
      { name: "MySQL", path: siMysql.path },
      { name: "SQL Server", path: DATABASE },
      { name: "Git", path: siGit.path },
      { name: "Vite", path: siVite.path },
    ],
  },
];

const total = groups.reduce((n, g) => n + g.items.length, 0);

export default function Stack() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    (_, contextSafe) => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" }, scrollTrigger: { trigger: root.current, start: "top 80%", refreshPriority: -1 } })
          .from("[data-stack-head]", { y: 16, autoAlpha: 0, duration: 1 })
          .from("[data-stack-card]", { y: 48, autoAlpha: 0, stagger: 0.12, duration: 1.2 }, "-=0.7")
          .from("[data-stack-item]", { y: 12, autoAlpha: 0, stagger: 0.035, duration: 0.8 }, "-=0.9");
      });

      // Luz em brasa que acompanha o cursor por cima dos três cartões
      const grid = root.current!.querySelector<HTMLElement>("[data-stack-grid]")!;
      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
      const onMove = contextSafe!((e: PointerEvent) => {
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--mx", `${e.clientX - r.left}px`);
          card.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
      });
      grid.addEventListener("pointermove", onMove);
      return () => {
        grid.removeEventListener("pointermove", onMove);
        mm.revert();
      };
    },
    { scope: root },
  );

  return (
    <div ref={root} className="mt-24 md:mt-36">
      <div data-stack-head className="flex items-end justify-between border-b border-bone/10 pb-5">
        <h3 className="eyebrow text-mute">Linguagens e ferramentas</h3>
        <span className="eyebrow text-mute tabular-nums">{total}</span>
      </div>

      <div data-stack-grid className="group/grid mt-6 grid gap-3 md:grid-cols-3">
        {groups.map((g) => (
          <section
            key={g.title}
            data-stack-card
            aria-label={g.title}
            className="glass relative overflow-hidden rounded-[20px] p-6"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/grid:opacity-100 [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgb(255_90_44/0.12),transparent_45%)]"
            />
            <div className="relative flex items-baseline justify-between">
              <h4 className="heading text-2xl">{g.title}</h4>
              <span className="text-sm text-mute tabular-nums">{String(g.items.length).padStart(2, "0")}</span>
            </div>
            <ul className="relative mt-8 divide-y divide-bone/10">
              {g.items.map((it) => (
                <li key={it.name} data-stack-item className="group flex items-center gap-4 py-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-bone/[0.06] text-bone/80 transition-colors duration-300 group-hover:bg-ember group-hover:text-ink">
                    {it.path ? (
                      <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[18px] fill-current">
                        <path d={it.path} />
                      </svg>
                    ) : (
                      <span aria-hidden="true" className="text-[13px] font-semibold">
                        {it.glyph}
                      </span>
                    )}
                  </span>
                  <span className="text-[15px] transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                    {it.name}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
