// Linha do tempo da seção Sobre, do mais antigo para o mais recente.
// Os anos de projetos e eventos ainda não foram informados; quando chegarem, preencha `when`.

export type TrajectoryItem = {
  when?: string;
  title: string;
  place?: string;
  text?: string;
  tags?: string[];
  /** Projetos de destaque ganham um cartão maior. */
  featured?: boolean;
};

export type TrajectoryGroup = {
  label: string;
  intro?: string;
  items: TrajectoryItem[];
};

export const trajectory: TrajectoryGroup[] = [
  {
    label: "Trabalho",
    intro:
      "Trabalho desde cedo com documentos, prazos e dados pessoais protegidos pela LGPD. Foi assim que aprendi a ser organizado e cuidadoso com os detalhes, e levo isso para cada projeto.",
    items: [
      { when: "2021 — 2022", title: "Jovem Aprendiz", place: "Construcar" },
      { when: "2022 — 2023", title: "Auxiliar administrativo", place: "Hospital Universitário Alzira Velano" },
      { when: "2023 — hoje", title: "Auxiliar administrativo", place: "UNIFAL" },
    ],
  },
  {
    label: "Formação",
    items: [
      {
        when: "Conclusão no fim de 2026",
        title: "Ciência da Computação",
        place: "UNIFENAS",
      },
    ],
  },
  {
    label: "Eventos e congressos",
    items: [
      { title: "XXXIII JOIN" },
      { title: "XXXVII JOIN", place: "Cibersegurança na Prática" },
      { title: "VII Hackathon UNIFENAS", place: "Tema “Não se vá com IA”" },
      { title: "IX Congresso de Computação", place: "UNIFENAS", text: "Apresentei o Cuidado+." },
    ],
  },
  {
    label: "Projetos de destaque",
    items: [
      {
        title: "Portfólios web",
        text: "Sites de portfólio feitos em projetos da faculdade.",
        tags: ["HTML", "CSS", "JavaScript"],
        featured: true,
      },
      {
        title: "Sistema de controle de caixa",
        text: "App desktop para registrar entradas e saídas, com banco de dados e relatórios em PDF.",
        tags: ["C#", "SQL Database", "PDF"],
        featured: true,
      },
      {
        title: "Cuidado+ (TCC)",
        text: "App mobile para quem cuida de idosos, com assistente de IA e relatórios em PDF para levar ao médico.",
        tags: ["React Native", "Expo", "Firebase"],
        featured: true,
      },
    ],
  },
];

/** Último marco da linha do tempo. */
export const trajectoryEnd = { when: "2026", title: "Entrando no mercado de tecnologia" };
