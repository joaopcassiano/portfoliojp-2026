import { gsap } from "./gsap";

// Tela de carregamento. A marcação e o estilo estão no index.html, para aparecerem já na
// primeira pintura, antes do JavaScript. Aqui ela conta até 100, espera a fonte e a foto
// da hero, e sai subindo; a abertura da hero começa enquanto ela sai.

let done = false;
const waiting: (() => void)[] = [];

/** Roda `cb` quando o preloader terminar (ou na hora, se já terminou). */
export function whenPreloaded(cb: () => void) {
  if (done) cb();
  else waiting.push(cb);
}

function finish() {
  if (done) return;
  done = true;
  waiting.splice(0).forEach((cb) => cb());
}

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** Espera a foto da hero carregar (a primeira coisa que a pessoa vê depois do preloader). */
function heroImage() {
  const img = document.querySelector<HTMLImageElement>('[data-photo="mono"]');
  if (!img || img.complete) return Promise.resolve();
  return new Promise<void>((r) => {
    img.addEventListener("load", () => r(), { once: true });
    img.addEventListener("error", () => r(), { once: true });
  });
}

export function runPreloader() {
  const el = document.getElementById("preloader");
  if (!el) return finish();

  const root = document.documentElement;
  const count = el.querySelector<HTMLElement>("[data-pl-count]")!;
  const bar = el.querySelector<HTMLElement>("[data-pl-bar]")!;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Conta até 90 sozinho; os últimos 10 só depois que a página estiver pronta
  const progress = { v: 0 };
  const render = () => {
    const v = Math.round(progress.v);
    count.textContent = String(v).padStart(3, "0");
    bar.style.transform = `scaleX(${progress.v / 100})`;
  };
  const counting = gsap.to(progress, { v: 90, duration: reduce ? 0.3 : 1.6, ease: "power2.out", onUpdate: render });

  // Pronto = fonte + foto da hero + tempo mínimo para a animação ser vista; nunca mais que 6 s
  const ready = Promise.race([
    Promise.all([document.fonts.ready, heroImage(), wait(reduce ? 300 : 1500)]),
    wait(6000),
  ]);

  ready.then(() => {
    counting.kill();
    const exit = gsap.timeline({
      onComplete: () => {
        el.remove();
        root.classList.remove("is-loading");
      },
    });
    exit.to(progress, { v: 100, duration: reduce ? 0.1 : 0.45, ease: "power2.out", onUpdate: render });
    if (reduce) {
      exit.to(el, { autoAlpha: 0, duration: 0.3 }).call(finish, [], "<");
      return;
    }
    exit
      // conteúdo some subindo por trás das próprias máscaras
      .to(el.querySelectorAll("[data-pl-mask] > *"), { yPercent: -110, duration: 0.7, ease: "power3.in", stagger: 0.05 }, "+=0.1")
      .to(bar, { scaleY: 0, transformOrigin: "50% 100%", duration: 0.4, ease: "power2.in" }, "<")
      // o painel sobe e revela a hero, que começa a abrir junto
      .to(el, { yPercent: -100, duration: 1.1, ease: "expo.inOut" }, "-=0.15")
      .call(finish, [], "<+=0.25");
  });
}
