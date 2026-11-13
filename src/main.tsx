import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "@fontsource-variable/instrument-sans/wght.css";
import "./index.css";
import App from "./App";
import { runPreloader } from "./lib/preloader";

// Ao recarregar (F5), a página volta ao topo e o preloader roda de novo, em vez de o navegador
// devolver a pessoa ao ponto onde parou
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash) history.replaceState(null, "", location.pathname + location.search);
window.scrollTo(0, 0);

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// No site publicado o HTML já vem pré-renderizado (scripts/prerender.mjs): só ligamos o React nele.
// No modo de desenvolvimento a página chega vazia e é montada do zero.
if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);

runPreloader();
