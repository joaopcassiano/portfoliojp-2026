// Etapas da seção Processo. Aqui a numeração faz sentido: é uma sequência.

export type ProcessStep = {
  title: string;
  text: string;
  /** O que o cliente recebe ao fim da etapa. */
  delivers: string;
  visual: "chat" | "wireframe" | "code" | "motion" | "launch";
};

export const steps: ProcessStep[] = [
  {
    title: "Entender",
    text: "Começo com uma conversa para descobrir o objetivo do projeto, para quem ele é e qual é o prazo.",
    delivers: "Um resumo do projeto com objetivo, público e prazo",
    visual: "chat",
  },
  {
    title: "Desenhar",
    text: "Monto os wireframes e o layout no Figma e ajusto junto com você até ficar como combinamos.",
    delivers: "O protótipo no Figma para aprovar",
    visual: "wireframe",
  },
  {
    title: "Codar",
    text: "Transformo o layout aprovado em código, com HTML, CSS, JavaScript e TypeScript, sem perder nenhum detalhe.",
    delivers: "O site funcionando, igual ao protótipo",
    visual: "code",
  },
  {
    title: "Dar vida",
    text: "Adiciono animações e interações com GSAP, para a página responder ao que a pessoa faz.",
    delivers: "Animações e interações no site",
    visual: "motion",
  },
  {
    title: "Entregar",
    text: "Testo no celular e no computador, publico o site e faço os ajustes finais.",
    delivers: "O site no ar",
    visual: "launch",
  },
];
