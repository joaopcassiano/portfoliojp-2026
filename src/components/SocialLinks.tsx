import { siGithub, siGmail, siInstagram } from "simple-icons";

export const socials = [
  { label: "Instagram", href: "https://www.instagram.com/_9joaopedro/", path: siInstagram.path },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/jo%C3%A3o-pedro-pereira-cassiano/", path: null },
  { label: "GitHub", href: "https://github.com/joaopcassiano", path: siGithub.path },
  { label: "E-mail", href: "mailto:dev.jpcassiano@gmail.com", path: siGmail.path },
];

// O LinkedIn não está no simple-icons, então o ícone é desenhado à mão.
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[15px] fill-current">
      <path d="M3.5 8.8h3.6V20H3.5z" />
      <circle cx="5.3" cy="5.1" r="2.1" />
      <path d="M9.6 8.8h3.4v1.6c.5-.9 1.8-1.9 3.7-1.9 3.7 0 4.3 2.4 4.3 5.4V20h-3.6v-5.3c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20H9.6z" />
    </svg>
  );
}

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {socials.map((s) => (
        <li key={s.label} data-social>
          <a
            href={s.href}
            target={s.href.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer"
            aria-label={s.label}
            title={s.label}
            className="glass group grid size-11 place-items-center rounded-full text-bone/75 transition-[color,background-color,border-color] duration-300 hover:border-ember/60 hover:bg-ember hover:text-ink"
          >
            {s.path ? (
              <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[15px] fill-current">
                <path d={s.path} />
              </svg>
            ) : (
              <LinkedInIcon />
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}
