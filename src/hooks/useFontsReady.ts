import { useEffect, useState } from "react";

/** true quando as fontes terminam de carregar (para dividir texto e medir layout no lugar certo). */
export function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    document.fonts.ready.then(() => setReady(true));
  }, []);
  return ready;
}
