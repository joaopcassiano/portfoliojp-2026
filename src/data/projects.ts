// Projetos da seção Projetos.
// TODO: trocar descrições e adicionar `image` quando os mockups/prints chegarem.
export type Project = {
  title: string;
  category: string;
  tags: string[];
  description: string;
  year: string;
  href: string;
  /** Caminho do print/mockup (ex.: import de src/assets). Sem imagem, mostra a moldura reservada. */
  image?: string;
};

const repo = (name: string) => `https://github.com/joaopcassiano/${name}`;

export const projects: Project[] = [
  {
    title: "Cuidado+",
    category: "Web",
    tags: ["HTML", "CSS", "JavaScript"],
    description: "Descrição do projeto em breve.",
    year: "2026",
    href: repo("cuidado-mais-web"),
  },
  {
    title: "+Apoio",
    category: "UI/UX Design",
    tags: ["Figma", "JavaScript"],
    description: "Descrição do projeto em breve.",
    year: "2024",
    href: repo("ATEX-VIII"),
  },
  {
    title: "MyGastronomy",
    category: "Web",
    tags: ["JavaScript"],
    description: "Descrição do projeto em breve.",
    year: "2025",
    href: repo("MyGastronomy"),
  },
  {
    title: "BudgetBoss",
    category: "Back-end",
    tags: ["C#", ".NET"],
    description: "Descrição do projeto em breve.",
    year: "2024",
    href: repo("BudgetBoss"),
  },
];
