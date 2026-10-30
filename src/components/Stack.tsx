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
import { revealOnScroll } from "../lib/scrollFx";

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

        const opts = { refreshPriority };
        revealOnScroll("[data-stack-head] > *", "[data-stack-head]", { x: -80, autoAlpha: 0 }, { ...opts, stagger: 0.1 });

        // Cada cartão chega de um lado: esquerda, de baixo e direita
        const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]");
        const vw = () => window.innerWidth;
        const sides = [
          { x: () => -vw() * 0.5, rotation: -14, autoAlpha: 0 },
          { y: 240, scale: 0.7, autoAlpha: 0 },
          { x: () => vw() * 0.5, rotation: 14, autoAlpha: 0 },
        ];
        cards.forEach((card, i) => {
          // O gatilho é o espaço do cartão (que não se move), para a medição não sofrer com a animação
          const slot = card.parentElement!;
          // No celular os cartões ficam empilhados: alternam entre esquerda e direita
          const from = wide ? sides[i % 3] : sides[i % 2 === 0 ? 0 : 2];
          const delay = wide ? i * 0.12 : 0;
          revealOnScroll(card, wide ? "[data-stack-grid]" : slot, from, { ...opts, delay, duration: 1.5 });

          // Itens entram alternando os lados, saindo do desfoque, logo depois do cartão
          revealOnScroll(
            card.querySelectorAll("[data-stack-item]"),
            wide ? "[data-stack-grid]" : slot,
            { x: (j: number) => (j % 2 === 0 ? -50 : 50), autoAlpha: 0, filter: "blur(6px)" },
            { ...opts, delay: delay + 0.5, stagger: 0.06, duration: 1 },
          );
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
    <div ref={root} className="mt-16 md:mt-24">
      {/* Subtítulo dentro do Processo (não é uma seção nova, por isso sem número nem linha) */}
      <div data-stack-head className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h3 className="heading text-3xl md:text-4xl">Com o que eu trabalho</h3>
        <span className="text-sm text-mute tabular-nums">{total} linguagens e ferramentas</span>
      </div>

      <div data-stack-grid className="group/grid mt-8 grid gap-3 md:grid-cols-3">
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
