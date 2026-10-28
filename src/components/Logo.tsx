import { DOT, J_PATH, P_PATH, SYMBOL, WORD } from "./logo-paths";

type Props = {
  /** "full" = símbolo + CASSIANO; "symbol" = só o JP */
  variant?: "full" | "symbol";
  className?: string;
};

/** Logo JP Cassiano. A cor do desenho vem de `currentColor`; o ponto é sempre brasa. */
export default function Logo({ variant = "full", className = "" }: Props) {
  const full = variant === "full";
  const view = full ? `8 0 ${WORD.width - 8} ${SYMBOL.height}` : `8 0 ${SYMBOL.width - 8} ${SYMBOL.height}`;
  return (
    <svg viewBox={view} className={`fill-current ${className}`} role="img" aria-label="JP Cassiano">
      <path fillRule="evenodd" d={P_PATH} />
      <path d={J_PATH} />
      <circle cx={DOT.cx} cy={DOT.cy} r={DOT.r} className="fill-ember" />
      {full && <path transform={`translate(${WORD.x} 0)`} d={WORD.d} />}
    </svg>
  );
}
