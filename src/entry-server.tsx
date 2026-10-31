// Usado só no build: monta o site uma vez para o HTML já sair com todo o conteúdo (bom para o Google
// e para a primeira pintura). No navegador, o main.tsx "hidrata" esse HTML e liga as animações.
import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";

export function render() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
