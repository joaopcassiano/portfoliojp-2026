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
import { scrollInOut } from "../lib/scrollFx";

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
      mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 768px)" }, (ctx) => {
        const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
        if (!motion) return;
        // Montado antes do pin da hero: estes gatilhos são medidos depois dele
        const refreshPriority = -1;

        scrollInOut("[data-stack-head] h3", "[data-stack-head]", {
          from: { x: -120, autoAlpha: 0 },
          exit: { x: -80, autoAlpha: 0 },
          leave: ["top 0%", "top -15%"],
          refreshPriority,
        });
        scrollInOut("[data-stack-count]", "[data-stack-head]", {
          from: { x: 120, autoAlpha: 0 },
          exit: { x: 80, autoAlpha: 0 },
          leave: ["top 0%", "top -15%"],
          refreshPriority,
        });
        scrollInOut("[data-stack-line]", "[data-stack-head]", {
          from: { scaleX: 0 },
          exit: { scaleX: 0, transformOrigin: "100% 50%" },
          leave: ["top 0%", "top -15%"],
          refreshPriority,
        });

        // Cada cartão chega de um lado: esquerda, de baixo e direita; ao sair, volta para o seu lado
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
        const vw = () => window.innerWidth;
        const sides = [
          { from: { x: () => -vw() * 0.6, rotation: -14, autoAlpha: 0 }, exit: { x: () => -vw() * 0.4, rotation: -8, autoAlpha: 0 } },
          { from: { y: 260, scale: 0.7, autoAlpha: 0 }, exit: { y: -200, scale: 0.85, autoAlpha: 0 } },
          { from: { x: () => vw() * 0.6, rotation: 14, autoAlpha: 0 }, exit: { x: () => vw() * 0.4, rotation: 8, autoAlpha: 0 } },
        ];
        cards.forEach((card, i) => {
          // O gatilho é o espaço do cartão (que não se move), para a medição não sofrer com a animação
          const slot = card.parentElement!;
          // No celular os cartões ficam empilhados: alternam entre esquerda e direita
          const fx = wide ? sides[i % 3] : sides[i % 2 === 0 ? 0 : 2];
          scrollInOut(card, wide ? "[data-stack-grid]" : slot, {
            ...fx,
            enter: wide ? ["top 100%", "top 45%"] : ["top 100%", "top 55%"],
            leave: ["bottom 40%", "bottom -5%"],
            refreshPriority,
          });

          // Itens entram alternando os lados, saindo do desfoque
          gsap.from(card.querySelectorAll("[data-stack-item]"), {
            x: (j: number) => (j % 2 === 0 ? -60 : 60),
            autoAlpha: 0,
            filter: "blur(6px)",
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: { trigger: slot, start: "top 80%", end: "top 30%", scrub: 0.8, refreshPriority },
          });
        });
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
      <div data-stack-head className="relative flex items-end justify-between pb-5">
        <span data-stack-line aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px origin-left bg-bone/10" />
        <h3 className="eyebrow text-mute">Linguagens e ferramentas</h3>
        <span data-stack-count className="eyebrow text-mute tabular-nums">{total}</span>
      </div>

      <div data-stack-grid className="group/grid mt-6 grid gap-3 md:grid-cols-3">
        {groups.map((g) => (
          <div key={g.title}>
            <section
              data-stack-card
              aria-label={g.title}
              className="glass relative h-full overflow-hidden rounded-[20px] p-6"
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
          </div>
        ))}
      </div>
    </div>
  );
}
