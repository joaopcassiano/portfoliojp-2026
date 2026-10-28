"""Gera o logo JP Cassiano: símbolo (conceito Giro · Ponto) + palavra CASSIANO em contornos.

Uso: python brand/logo/build_logo.py   (rodar na raiz do projeto; precisa de fonttools e brotli)

Saídas:
  brand/logo/final/*.svg          arquivos-mestre (símbolo, logo horizontal, favicon) em versões clara e escura
  src/components/logo-paths.ts    os mesmos desenhos para o componente <Logo /> do site
  public/favicon.svg              ícone da aba
"""
from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "brand/logo/final"
FONT = ROOT / "node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2"

INK, BONE, EMBER = "#09090A", "#EDE9E3", "#FF5A2C"

# ── Símbolo (grade de 8 unidades; topo do P em y=0, base do bojo em y=112, fim do J em y=176)
SYMBOL_W, SYMBOL_H = 160, 176
P_PATH = "M64 0H104A56 56 0 0 1 104 112H96V176H64Z M96 32V80H104A24 24 0 0 0 104 32Z"
J_PATH = "M72 176H64A56 56 0 0 1 8 120H40A24 24 0 0 0 64 144H72Z"
DOT = (24, 84, 16)  # cx, cy, r — o "ponto fixo" da foto

# ── Palavra: altura das maiúsculas = altura do bojo do P, assim CASSIANO se alinha ao P
CAP_TOP, BASELINE = 0, 112
WORD, GAP, TRACKING = "CASSIANO", 40, 0.06  # tracking em em


def word_path():
    font = TTFont(FONT)
    font = instantiateVariableFont(font, {"wght": 560, "wdth": 118})
    cap = font["OS/2"].sCapHeight
    scale = (BASELINE - CAP_TOP) / cap
    glyphs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font["hmtx"]
    upm = font["head"].unitsPerEm

    pen = SVGPathPen(glyphs, ntos=lambda v: f"{v:.1f}".rstrip("0").rstrip("."))
    x = 0.0
    for i, ch in enumerate(WORD):
        name = cmap[ord(ch)]
        glyphs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x, BASELINE)))
        x += hmtx[name][0] * scale
        if i < len(WORD) - 1:
            x += TRACKING * upm * scale
    return pen.getCommands(), x


def svg(view, body, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view}" role="img" aria-labelledby="t">'
        f'<title id="t">{title}</title>{body}</svg>\n'
    )


def symbol_body(mark, dot, dx=0):
    g = f'<g transform="translate({dx} 0)">' if dx else "<g>"
    return (
        f'{g}<path fill="{mark}" fill-rule="evenodd" d="{P_PATH}"/><path fill="{mark}" d="{J_PATH}"/>'
        f'<circle fill="{dot}" cx="{DOT[0]}" cy="{DOT[1]}" r="{DOT[2]}"/></g>'
    )


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    word_d, word_w = word_path()
    word_x = SYMBOL_W + GAP
    lockup_w = round(word_x + word_w)

    for variant, mark in (("escuro", BONE), ("claro", INK)):
        # símbolo com respiro quadrado
        (OUT / f"jp-simbolo-{variant}.svg").write_text(
            svg("-24 -16 208 208", symbol_body(mark, EMBER), "JP Cassiano"), encoding="utf-8"
        )
        # logo horizontal: símbolo + CASSIANO
        body = symbol_body(mark, EMBER) + f'<path fill="{mark}" transform="translate({word_x} 0)" d="{word_d}"/>'
        (OUT / f"jp-cassiano-horizontal-{variant}.svg").write_text(
            svg(f"8 0 {lockup_w - 8} {SYMBOL_H}", body, "JP Cassiano"), encoding="utf-8"
        )

    # favicon: fundo escuro arredondado, ponto um pouco maior para não sumir em 16 px
    fav_dot = (DOT[0], DOT[1], 20)
    fav = (
        f'<rect x="-40" y="-32" width="240" height="240" rx="56" fill="{INK}"/>'
        f'<path fill="{BONE}" fill-rule="evenodd" d="{P_PATH}"/><path fill="{BONE}" d="{J_PATH}"/>'
        f'<circle fill="{EMBER}" cx="{fav_dot[0]}" cy="{fav_dot[1]}" r="{fav_dot[2]}"/>'
    )
    fav_svg = svg("-40 -32 240 240", fav, "JP Cassiano")
    (OUT / "jp-favicon.svg").write_text(fav_svg, encoding="utf-8")
    (ROOT / "public").mkdir(exist_ok=True)
    (ROOT / "public/favicon.svg").write_text(fav_svg, encoding="utf-8")

    ts = (
        "// Gerado por brand/logo/build_logo.py — não editar à mão.\n"
        f"export const SYMBOL = {{ width: {SYMBOL_W}, height: {SYMBOL_H} }};\n"
        f'export const P_PATH = "{P_PATH}";\n'
        f'export const J_PATH = "{J_PATH}";\n'
        f"export const DOT = {{ cx: {DOT[0]}, cy: {DOT[1]}, r: {DOT[2]} }};\n"
        f"export const WORD = {{ x: {word_x}, width: {lockup_w}, d: \"{word_d}\" }};\n"
    )
    (ROOT / "src/components/logo-paths.ts").write_text(ts, encoding="utf-8")
    print("ok", lockup_w)


if __name__ == "__main__":
    main()
