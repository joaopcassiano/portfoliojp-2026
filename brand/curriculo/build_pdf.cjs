// Gera public/curriculo.pdf a partir de curriculo.html, usando o Edge instalado no Windows.
// Uso: node brand/curriculo/build_pdf.cjs  (precisa do pacote puppeteer-core: npx -p puppeteer-core node ...)
const path = require("path");
const puppeteer = require("puppeteer-core");

const EDGE = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";
const src = path.join(__dirname, "curriculo.html");
const out = path.join(__dirname, "../../public/curriculo.pdf");

(async () => {
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: "new", args: ["--allow-file-access-from-files"] });
  const page = await browser.newPage();
  await page.goto("file:///" + src.replace(/\\/g, "/"), { waitUntil: "networkidle0" });
  await page.evaluate(() => document.fonts.ready);
  // Margens vêm do @page do HTML; o PDF sai com texto de verdade (selecionável e legível por ATS)
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, tagged: true });
  await browser.close();
  console.log(out);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
