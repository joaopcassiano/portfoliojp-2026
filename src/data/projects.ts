// Projetos da seção Projetos.
import cuidadoDesktop from "../assets/projects/cuidado-desktop.webp";
import cuidadoApp from "../assets/projects/cuidado-app.webp";
import vortekDesktop from "../assets/projects/vortek-desktop.webp";
import vortekMobile from "../assets/projects/vortek-mobile.webp";

export type Project = {
  title: string;
  category: string;
  tags: string[];
  description: string;
  year: string;
  /** Para onde o botão de seta leva (site publicado ou repositório). */
  href: string;
  /** Endereço exibido na barra do navegador do mockup. */
  url?: string;
  /** Print da versão desktop. Sem imagem, mostra a moldura reservada. */
  image?: string;
  /** Print de uma tela no celular, exibido numa moldura de telefone sobre o print desktop. */
  mobileImage?: string;
};

export const projects: Project[] = [
  {
    title: "Cuidado+",
    category: "Landing page e app",
    tags: ["HTML", "CSS", "JavaScript"],
    description:
      "Landing page de um app que ajuda familiares e cuidadores a acompanhar a rotina de idosos: consultas, medicamentos, lembretes e um assistente com IA.",
    year: "2026",
    href: "https://joaopcassiano.github.io/cuidado-mais-web/",
    url: "https://joaopcassiano.github.io/cuidado-mais-web/",
    image: cuidadoDesktop,
    mobileImage: cuidadoApp,
  },
  {
    title: "Vortek Boost",
    category: "Landing page",
    tags: ["React", "TypeScript", "Three.js"],
    description:
      "Landing page da Vortek Boost, que otimiza PCs e faz sites, softwares sob medida e identidade visual. Na abertura, o símbolo da marca é montado em 3D, e cada serviço tem uma demonstração interativa.",
    year: "2026",
    href: "https://vortekboost.pages.dev/",
    url: "https://vortekboost.pages.dev/",
    image: vortekDesktop,
    mobileImage: vortekMobile,
  },
];
