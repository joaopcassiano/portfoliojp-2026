import { gsap } from "./gsap";

type Options = {
  stagger?: gsap.TweenVars["stagger"];
  duration?: number;
  delay?: number;
  ease?: string;
  /** Ponto em que a animação dispara, na sintaxe do ScrollTrigger. */
  start?: string;
  /** Use -1 em gatilhos montados antes do pin da hero, para serem medidos depois dele. */
  refreshPriority?: number;
};

/**
 * Entrada que toca sozinha quando o gatilho chega na tela (não depende da velocidade do scroll).
 * Se a pessoa voltar para cima além do gatilho, a animação se desfaz e toca de novo na próxima vez.
 */
export function revealOnScroll(targets: gsap.TweenTarget, trigger: gsap.DOMTarget, from: gsap.TweenVars, opts: Options = {}) {
  const { stagger = 0, duration = 1.3, delay = 0, ease = "expo.out", start = "top 85%", refreshPriority } = opts;
  return gsap.from(targets, {
    ...from,
    duration,
    delay,
    stagger,
    ease,
    scrollTrigger: { trigger, start, toggleActions: "play none none reverse", refreshPriority },
  });
}
