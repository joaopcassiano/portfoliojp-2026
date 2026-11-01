# Portfólio · JP Cassiano

Portfólio pessoal de **João Pedro Pereira Cassiano**, design developer. Uma página só, escura e animada, que apresenta quem eu sou, meus projetos, como eu trabalho e como falar comigo.

**No ar:** [jpcassiano.pages.dev](https://jpcassiano.pages.dev)

![Abertura do portfólio](public/og-image.jpg)

## Stack

| Área | Tecnologia |
| --- | --- |
| Base | React 19, TypeScript, Vite |
| Estilo | Tailwind CSS v4 (tokens em `@theme`) |
| Animação | GSAP 3 (ScrollTrigger, SplitText) com `@gsap/react` |
| Rolagem suave | Lenis, sincronizada com o ScrollTrigger |
| Ícones | simple-icons (SVG inline) |
| Fonte | Instrument Sans (variável, via Fontsource) |
| Imagens | sharp (AVIF + WebP em dois tamanhos) |
| Hospedagem | Cloudflare Pages, com deploy automático a cada push na `main` |

## Seções

1. **Início (hero):** foto em tela cheia que, com a rolagem, aproxima do rosto, ganha cor e revela título, texto, serviços e status. O título troca de palavra sozinho (encanta, converte, se move, permanece).
2. **Sobre:** apresentação, números (repositórios públicos lidos da API do GitHub) e a linha do tempo da trajetória.
3. **Projetos:** painéis presos na tela que empilham um sobre o outro, com print desktop e mobile e vídeo de apresentação em modal.
4. **Processo:** as 5 etapas de trabalho, abertas uma a uma conforme a rolagem, com um visual animado para cada etapa, e a lista de linguagens e ferramentas.
5. **Contato:** e-mail (abre o Gmail ou copia o endereço), redes, status com hora local e download do currículo em PDF.

## Como rodar

Precisa de Node.js 20.19 ou mais novo.

```bash
npm install
npm run dev        # servidor de desenvolvimento
npm run build      # checa os tipos, gera o build e pré-renderiza o HTML
npm run preview    # serve o build final em http://localhost:4173
npm run images     # gera as versões AVIF/WebP da foto da hero a partir de HERO.png
```

## Estrutura

```text
src/
  App.tsx              Lenis + ordem das seções
  main.tsx             entrada no navegador (hidrata o HTML pré-renderizado)
  entry-server.tsx     entrada usada só no build, para gerar o HTML
  index.css            tokens de cor e fonte, classes de tipografia, efeitos globais
  components/          uma seção por arquivo (Hero, About, Projects, Process, Contact...)
  data/                conteúdo editável: projetos, etapas do processo, trajetória
  hooks/               useFontsReady, useLocalTime
  lib/
    gsap.ts            registro único dos plugins do GSAP
    lenis.ts           instância global da rolagem suave e scrollToY()
    scrollFx.ts        revealOnScroll(), a entrada padrão das animações
scripts/
  prerender.mjs        injeta o HTML renderizado e os preloads no dist/index.html
  optimize-images.mjs  gera as imagens da hero
public/                arquivos servidos como estão (vídeos, ícones, PDF, SEO, _headers)
brand/                 logo, capa do LinkedIn e a fonte do currículo
```

O texto dos projetos, das etapas e da trajetória fica em `src/data/`. Para adicionar um projeto, basta incluir um item em `src/data/projects.ts` com os prints em `src/assets/projects/`.

## Animações

- **Uma entrada padrão.** `revealOnScroll()` toca a animação inteira quando o elemento chega na tela, em vez de prender o progresso à velocidade da rolagem, e desfaz se a pessoa voltar para cima.
- **Gatilhos em elementos que não se movem.** O ScrollTrigger mede o contêiner, não o elemento animado, para a posição não mudar durante a animação.
- **Ordem de medição.** Componentes montados antes de seções presas (pin) usam `refreshPriority: -1` para serem medidos depois delas.
- **Movimento reduzido.** Tudo passa por `gsap.matchMedia()`: com `prefers-reduced-motion`, o site mostra o estado final sem animar.
- **Loops pausados fora da tela.** Animações contínuas (palavra do título, cartões do processo) só rodam quando estão visíveis.
- **Desempenho de pintura.** As camadas grandes que se movem levam `will-change: transform`. As medições mostraram que o gargalo era a pintura na GPU, não o JavaScript.

## SEO

- **HTML pré-renderizado.** O build roda o React no servidor (`renderToString`) e grava o resultado no `index.html`, então o Google e as prévias de link recebem o conteúdo sem depender do JavaScript. No navegador, `hydrateRoot` assume esse HTML.
- **Metadados:** título, descrição, URL canônica, Open Graph e Twitter Card, com uma imagem de compartilhamento de 1200×630.
- **Dados estruturados (JSON-LD):** `Person`, `WebSite` e `ProfilePage`, ligando o site aos perfis do GitHub, LinkedIn e Instagram.
- **Arquivos para buscadores:** `robots.txt`, `sitemap.xml`, `manifest.webmanifest` e ícones.
- **Google Search Console** verificado, com a página indexada.

## Desempenho

- Preload da fonte e da foto da hero, com o mesmo `srcset` da `<picture>`, para o navegador baixar só o tamanho que vai usar.
- Imagens em AVIF com WebP de reserva, em dois tamanhos.
- Vídeos e prints carregados sob demanda (`loading="lazy"`; o vídeo só carrega ao abrir o modal).
- Cache longo na Cloudflare para arquivos com hash no nome (`public/_headers`).
- Medido num celular simulado (4G, CPU 4× mais lenta): o maior elemento da tela aparece em ~0,9 s, sem mudança de layout (CLS 0).

## Deploy

O repositório está ligado ao Cloudflare Pages. Cada push na `main` gera um novo deploy com:

- Comando de build: `npm run build`
- Pasta publicada: `dist`

O Cloudflare Web Analytics está ativo no projeto. Ele conta as visitas sem cookies.

## Currículo

O PDF em `public/curriculo.pdf` é gerado a partir de `brand/curriculo/curriculo.html`, em uma coluna e com texto selecionável, para ser lido pelos sistemas de triagem de vagas (ATS). Depois de editar o HTML, gere de novo (usa o Microsoft Edge instalado no Windows):

```bash
npm install --no-save puppeteer-core
node brand/curriculo/build_pdf.cjs
```

O botão "Baixar currículo" do Contato aparece sozinho quando o arquivo existe.

## Autor

**João Pedro Pereira Cassiano** · Alfenas, MG
[Portfólio](https://jpcassiano.pages.dev) · [LinkedIn](https://www.linkedin.com/in/jo%C3%A3o-pedro-pereira-cassiano/) · [GitHub](https://github.com/joaopcassiano) · dev.jpcassiano@gmail.com

O Claude, da Anthropic, auxiliou em pontos específicos do projeto, como a revisão de desempenho das animações e a configuração de SEO.
