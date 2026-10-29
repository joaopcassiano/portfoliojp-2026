// Projetos da seção Projetos.
import cuidadoDesktop from "../assets/projects/cuidado-desktop.webp";
import cuidadoApp from "../assets/projects/cuidado-app.webp";
import vortekDesktop from "../assets/projects/vortek-desktop.webp";
import vortekMobile from "../assets/projects/vortek-mobile.webp";
import vortekPoster from "../assets/projects/vortek-video-poster.webp";
import cuidadoPoster from "../assets/projects/cuidado-video-poster.webp";

export type Project = {
  title: string;
  category: string;
  /** Tecnologias separadas por parte do projeto (ex.: Site e App), cada parte num bloco próprio. */
  stack: { label: "Site" | "App"; items: string[] }[];
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
  /** Vídeo de apresentação (arquivo em public/videos), aberto num player em tela cheia. */
  video?: { src: string; poster: string; duration: string };
};

export const projects: Project[] = [
  {
    title: "Cuidado+",
    category: "Landing page e app",
    stack: [
      { label: "Site", items: ["HTML", "CSS", "JavaScript"] },
      { label: "App", items: ["React Native", "Expo", "JavaScript", "Firebase"] },
    ],
    description:
      "Landing page do Cuidado+, um app que ajuda familiares e cuidadores a acompanhar a rotina de idosos. A página apresenta os recursos do app, como agenda de consultas, controle de medicamentos, lembretes, relatórios e um assistente com IA, e mostra o que ele tem de diferente: letras grandes e navegação simples, pensadas para quem é cuidado.",
    year: "2026",
    href: "https://joaopcassiano.github.io/cuidado-mais-web/",
    url: "https://joaopcassiano.github.io/cuidado-mais-web/",
    image: cuidadoDesktop,
    mobileImage: cuidadoApp,
    video: { src: `${import.meta.env.BASE_URL}videos/cuidado-lancamento.mp4`, poster: cuidadoPoster, duration: "0:25" },
  },
  {
    title: "Vortek Boost",
    category: "Landing page",
    stack: [{ label: "Site", items: ["React", "TypeScript", "Three.js"] }],
    description:
      "Landing page da Vortek Boost, que otimiza PCs e cria sites, softwares sob medida e identidades visuais. Na abertura, o símbolo da marca é montado em 3D conforme a pessoa rola a página. Cada serviço tem uma demonstração interativa, como o boost de desempenho do PC, e o formulário monta o pedido de orçamento, que chega por e-mail.",
    year: "2026",
    href: "https://vortekboost.pages.dev/",
    url: "https://vortekboost.pages.dev/",
    image: vortekDesktop,
    mobileImage: vortekMobile,
    video: { src: `${import.meta.env.BASE_URL}videos/vortek-apresentacao.mp4`, poster: vortekPoster, duration: "0:30" },
  },
];
