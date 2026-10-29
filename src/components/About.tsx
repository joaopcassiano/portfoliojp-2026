import { useEffect, useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "../lib/gsap";
import { revealOnScroll } from "../lib/scrollFx";
import Magnetic from "./Magnetic";
import { ArrowIcon } from "./Navbar";
import Stack from "./Stack";
import hero900Avif from "../assets/hero-900.avif";
import hero900Webp from "../assets/hero-900.webp";
import hero1672Avif from "../assets/hero-1672.avif";
import hero1672Webp from "../assets/hero-1672.webp";

const GITHUB_USER = "joaopcassiano";
const REPOS_FALLBACK = "39";

/** Número de repositórios públicos, lido do GitHub (com valor de reserva se a API falhar). */
function useRepoCount() {
  const [count, setCount] = useState(REPOS_FALLBACK);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://api.github.com/users/${GITHUB_USER}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => typeof d?.public_repos === "number" && setCount(d.public_repos))
      .catch(() => {});
    return () => ctrl.abort();
  }, []);
  return count;
}

export default function About() {
  const root = useRef<HTMLElement>(null);
  const repos = useRepoCount();
  const reposRef = useRef(repos);
  reposRef.current = repos;
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => setFontsReady(true));
  }, []);

  useGSAP(
    () => {
      if (!fontsReady) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: "(prefers-reduced-motion: no-preference)", wide: "(min-width: 640px)" }, (ctx) => {
        const { motion, wide } = ctx.conditions as { motion: boolean; wide: boolean };
        if (!motion) return;
        gsap.set("[data-about-reveal]", { autoAlpha: 1 });
        const rnd = gsap.utils.random;
        const vw = () => window.innerWidth;

        // ── Abertura: as palavras chegam espalhadas e montam a frase (toca sozinha ao chegar) ──
        const statement = SplitText.create("[data-statement]", { type: "words" });
        revealOnScroll("[data-about-eyebrow]", "[data-about-intro]", { x: -80, autoAlpha: 0 }, { start: "top 80%" });
        revealOnScroll(
          statement.words,
          "[data-about-intro]",
          {
            x: () => rnd(-vw() * 0.4, vw() * 0.4),
            y: () => rnd(-240, 240),
            rotation: () => rnd(-40, 40),
            scale: () => rnd(0.5, 1.5),
            autoAlpha: 0,
            filter: "blur(12px)",
          },
          { start: "top 80%", duration: 1.6, stagger: { each: 0.02, from: "random" } },
        );
        // O único efeito preso ao scroll: a frase passa de cinza para branco, palavra por palavra
        gsap.fromTo(
          statement.words,
          { color: "#5f5c57" },
          {
            color: "#ede9e3",
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: "[data-statement]", start: "top 75%", end: "bottom 40%", scrub: true },
          },
        );

        // ── Foto: só salta na tela, já pronta e colorida ──
        revealOnScroll(
          "[data-about-figure]",
          "[data-about-figure-slot]",
          { y: 80, scale: 0.6, autoAlpha: 0 },
          { start: "top 80%", duration: 0.9, ease: "back.out(1.6)" },
        );

        // ── Parágrafos: as linhas deslizam da direita, saindo do desfoque ──
        gsap.utils.toArray<HTMLElement>("[data-about-body] p").forEach((p, i) => {
          const { lines } = SplitText.create(p, { type: "lines" });
          revealOnScroll(lines, p, { x: 140, autoAlpha: 0, filter: "blur(10px)" }, { stagger: 0.08, delay: i * 0.1 });
        });

        // ── Cartões: giram em 3D vindo da direita, como cartas sendo distribuídas ──
        const cardFrom = { x: 200, rotationY: -65, rotationZ: 6, autoAlpha: 0, transformOrigin: "100% 50%" };
        if (wide) {
          revealOnScroll("[data-about-card]", "[data-about-cards]", cardFrom, { stagger: 0.15, duration: 1.4 });
        } else {
          gsap.utils.toArray<HTMLElement>("[data-about-card]").forEach((card) => revealOnScroll(card, card, cardFrom));
        }

        revealOnScroll("[data-about-cta]", "[data-about-ctas]", { x: 120, autoAlpha: 0 }, { stagger: 0.12, start: "top 92%" });

        // ── Contador de repositórios: conta ao entrar e volta ao zero se a pessoa rolar para cima ──
        const counter = { n: 0 };
        const out = root.current!.querySelector<HTMLElement>("[data-repo-count]")!;
        gsap.to(counter, {
          n: () => reposRef.current,
          duration: 1.8,
          ease: "power3.out",
          onUpdate: () => (out.textContent = String(Math.round(counter.n))),
          scrollTrigger: { trigger: out, start: "top 85%", toggleActions: "play none none reverse" },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set("[data-about-reveal]", { autoAlpha: 1 });
        root.current!.querySelector<HTMLElement>("[data-repo-count]")!.textContent = String(reposRef.current);
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [fontsReady] },
  );

  return (
    <section id="sobre" ref={root} aria-labelledby="sobre-titulo" className="relative overflow-hidden px-5 pt-28 pb-24 md:px-10 md:pt-40 md:pb-32 lg:px-14">
      {/* ── Abertura: rótulo + frase que acende no scroll ── */}
      <div data-about-intro className="grid gap-8 lg:grid-cols-12">
        <div data-about-eyebrow className="eyebrow flex items-center gap-3 self-start text-mute lg:col-span-3 lg:pt-5">
          <span className="text-ember">(01)</span>
          <span className="h-px w-8 bg-bone/20" />
          <h2 id="sobre-titulo">Sobre mim</h2>
        </div>
        <p
          data-statement
          className="heading text-[clamp(30px,4vw,60px)] lg:col-span-9"
        >
          Meu nome é João Pedro Pereira Cassiano. Estudo Ciência da Computação e cuido do site{" "}
          inteiro
          <span className="text-ember">:</span> desenho a tela e escrevo o código que faz ela funcionar.
        </p>
      </div>

      {/* ── Foto + texto + números ── */}
      <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:gap-8">
        <div data-about-figure-slot className="lg:col-span-5">
          <figure data-about-figure>
            <div
              data-about-photo
              className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-graphite"
            >
              <picture>
                <source type="image/avif" srcSet={`${hero900Avif} 900w, ${hero1672Avif} 1672w`} sizes="(min-width: 1024px) 40vw, 100vw" />
                <img
                  src={hero1672Webp}
                  srcSet={`${hero900Webp} 900w, ${hero1672Webp} 1672w`}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  alt="Retrato de JP Cassiano visto de cima, olhando para a câmera"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover object-[52%_38%]"
                />
              </picture>
              <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 opacity-20" />
            </div>
            <figcaption className="eyebrow mt-4 flex items-center justify-between text-mute">
              <span className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-ember" />
                Alfenas, MG
              </span>
              <span>Design Developer</span>
            </figcaption>
          </figure>
        </div>

        <div className="flex flex-col justify-end lg:col-span-6 lg:col-start-7">
          <div data-about-body className="max-w-[560px] space-y-5 text-base leading-relaxed text-bone/70 md:text-lg">
            <p>
              Moro em Alfenas, Minas Gerais, e faço Ciência da Computação na UNIFENAS. No meu GitHub tem de tudo um
              pouco: C#, Java, Python e C++ da faculdade e dos cursos, e HTML, CSS e JavaScript nos projetos de
              front-end.
            </p>
            <p>
              Quero trabalhar como produtor criativo: entender o problema, pensar a solução e o layout e acompanhar o
              projeto até ele ir para o ar. Escrever o código é a parte em que coloco a mão na massa. Aprendo muito com
              quem tem mais experiência, então gosto de trabalhar em equipe.
            </p>
          </div>

          <ul data-about-cards className="mt-10 grid gap-3 [perspective:1200px] sm:grid-cols-3">
            <li data-about-card data-about-reveal className="glass flex flex-col justify-between gap-6 rounded-2xl p-5">
              <span className="eyebrow text-mute">GitHub</span>
              <span>
                <span data-repo-count className="display block text-5xl leading-none tabular-nums">
                  {repos}
                </span>
                <span className="mt-2 block text-[13px] text-mute">repositórios públicos</span>
              </span>
            </li>
            <li data-about-card data-about-reveal className="glass flex flex-col justify-between gap-6 rounded-2xl p-5">
              <span className="eyebrow text-mute">Graduação</span>
              <span>
                <span className="block text-[15px] text-bone">Ciência da Computação</span>
                <span className="mt-1 block text-[13px] text-mute">UNIFENAS</span>
              </span>
            </li>
            <li data-about-card data-about-reveal className="glass flex flex-col justify-between gap-6 rounded-2xl p-5">
              <span className="eyebrow text-mute">Objetivo</span>
              <span>
                <span className="block text-[15px] text-bone">Produtor criativo</span>
                <span className="mt-1 block text-[13px] text-mute">Do problema à solução</span>
              </span>
            </li>
          </ul>

          <div data-about-ctas className="mt-10 flex flex-wrap items-center gap-3">
            <div data-about-cta data-about-reveal>
              <Magnetic>
                <a
                  href={`https://github.com/${GITHUB_USER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-bone py-2 pr-2 pl-6 text-sm font-medium text-ink"
                >
                  <span className="absolute inset-0 translate-y-full rounded-full bg-ember transition-transform duration-500 ease-out-expo group-hover:translate-y-0" />
                  <span className="relative">Ver meu GitHub</span>
                  <span className="relative grid size-9 place-items-center rounded-full bg-ink text-bone">
                    <ArrowIcon className="size-3.5 transition-transform duration-500 ease-out-expo group-hover:rotate-45" />
                  </span>
                </a>
              </Magnetic>
            </div>
            <a
              data-about-cta
              data-about-reveal
              href="#contato"
              className="group relative px-4 py-3 text-sm text-bone/80 transition-colors hover:text-bone"
            >
              Vamos conversar
              <span className="absolute inset-x-4 bottom-2 h-px origin-right scale-x-0 bg-ember transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
            </a>
          </div>
        </div>
      </div>

      <Stack />
    </section>
  );
}
