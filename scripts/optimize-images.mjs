// Gera versões otimizadas (AVIF + WebP) da foto da hero a partir do HERO.png original.
import sharp from "sharp";

const src = "HERO.png";
const out = "src/assets";
const widths = [900, 1672];

for (const w of widths) {
  const img = sharp(src).resize({ width: w });
  await img.clone().avif({ quality: 68 }).toFile(`${out}/hero-${w}.avif`);
  await img.clone().webp({ quality: 88 }).toFile(`${out}/hero-${w}.webp`);
}
console.log("ok");
