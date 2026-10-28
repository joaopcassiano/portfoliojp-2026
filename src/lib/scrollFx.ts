import { gsap } from "./gsap";

type Options = {
  /** Estado de onde o alvo vem ao entrar pela parte de baixo da tela. */
  from: gsap.TweenVars;
  /** Estado para onde o alvo vai ao sair pelo topo da tela. */
  exit: gsap.TweenVars;
  stagger?: number;
  /** Faixa de scroll da entrada (start, end), na sintaxe do ScrollTrigger. */
  enter?: [string, string];
  /** Faixa de scroll da saída (start, end). */
  leave?: [string, string];
  /** Use -1 em gatilhos montados antes do pin da hero, para serem medidos depois dele. */
  refreshPriority?: number;
};

/**
 * Entrada e saída presas ao scroll: o alvo aparece ao surgir por baixo e some ao passar pelo topo.
 * Como as duas fases usam `scrub`, rolar de volta desfaz o movimento.
 */
export function scrollInOut(targets: gsap.TweenTarget, trigger: gsap.DOMTarget, opts: Options) {
  const { from, exit, stagger = 0, enter = ["top 95%", "top 62%"], leave = ["bottom 32%", "bottom 0%"], refreshPriority } = opts;

  gsap.from(targets, {
    ...from,
    stagger,
    ease: "power2.out",
    scrollTrigger: { trigger, start: enter[0], end: enter[1], scrub: 0.8, refreshPriority },
  });

  // Criada depois da entrada e sem render imediato, então parte do estado final da entrada
  gsap.to(targets, {
    ...exit,
    stagger,
    ease: "power1.in",
    immediateRender: false,
    scrollTrigger: { trigger, start: leave[0], end: leave[1], scrub: 0.8, refreshPriority },
  });
}
