// Pré-renderização: coloca o HTML do site dentro do dist/index.html depois do build.
// Assim o Google (e quem compartilha o link) recebe o conteúdo pronto, sem depender do JavaScript.
import { readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const dist = resolve("dist");
const ssrDir = resolve("dist-ssr");
const { render } = await import(pathToFileURL(resolve(ssrDir, "entry-server.js")).href);

let html = readFileSync(resolve(dist, "index.html"), "utf8");
const app = render();
if (!html.includes('<div id="root"></div>')) throw new Error("Não achei o <div id=\"root\"> no dist/index.html");
html = html.replace('<div id="root"></div>', `<div id="root">${app}</div>`);

// Pré-carrega a fonte (subconjunto latino) e a foto da hero, que é o maior elemento da primeira tela
const assets = readdirSync(resolve(dist, "assets"));
const font = assets.find((f) => /^instrument-sans-latin-wght-normal-.*\.woff2$/.test(f));
const hero900 = assets.find((f) => /^hero-900-.*\.avif$/.test(f));
const hero1672 = assets.find((f) => /^hero-1672-.*\.avif$/.test(f));
const preload = [
  font && `<link rel="preload" href="/assets/${font}" as="font" type="font/woff2" crossorigin />`,
  hero900 &&
    hero1672 &&
    // Mesmo srcset/sizes da <picture> da hero, para o navegador baixar só a versão que vai usar
    `<link rel="preload" as="image" type="image/avif" imagesrcset="/assets/${hero900} 900w, /assets/${hero1672} 1672w" imagesizes="(max-width: 768px) 200vw, 100vw" fetchpriority="high" />`,
]
  .filter(Boolean)
  .join("\n    ");
html = html.replace("</title>", `</title>\n    ${preload}`);

writeFileSync(resolve(dist, "index.html"), html);
rmSync(ssrDir, { recursive: true, force: true });
console.log(`pré-renderizado: ${Math.round(app.length / 1024)} KB de HTML`);
