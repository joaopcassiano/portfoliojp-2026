// Gera a capa do LinkedIn (1584x396, em 2x) com a logo completa do site.
// Uso: node brand/linkedin/build_capa.cjs
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const src = fs.readFileSync(path.join(__dirname, "../../src/components/logo-paths.ts"), "utf8");
const get = (re) => src.match(re)[1];
const P = get(/P_PATH = "([^"]+)"/);
const J = get(/J_PATH = "([^"]+)"/);
const [cx, cy, r] = get(/DOT = \{ ([^}]+) \}/).match(/[\d.]+/g).map(Number);
const wordX = Number(get(/WORD = \{ x: ([\d.]+)/));
const wordW = Number(get(/WORD = \{[^}]*width: ([\d.]+)/));
const word = get(/WORD = \{[^}]*d: "([^"]+)"/);

const W = 1584, H = 396;
const logoH = 96; // altura da logo na capa
const s = logoH / 176;
const logoW = (wordW - 8) * s;
// Um pouco à direita do centro: no LinkedIn a foto de perfil cobre o canto inferior esquerdo
const x = W * 0.58 - logoW / 2 - 8 * s;
const y = (H - logoH) / 2;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#09090A"/>
  <g transform="translate(${x} ${y}) scale(${s})" fill="#EDE9E3">
    <path fill-rule="evenodd" d="${P}"/>
    <path d="${J}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#FF5A2C"/>
    <path transform="translate(${wordX} 0)" d="${word}"/>
  </g>
</svg>`;

const out = path.join(__dirname, "capa-linkedin-jp-cassiano.png");
sharp(Buffer.from(svg), { density: 144 }).resize(W * 2, H * 2).png().toFile(out).then(() => console.log(out));
