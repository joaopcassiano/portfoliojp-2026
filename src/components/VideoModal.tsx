import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { gsap } from "../lib/gsap";
import { scroller } from "../lib/lenis";

type Props = {
  open: boolean;
  onClose: () => void;
  src: string;
  poster: string;
  title: string;
};

/** Player em tela cheia para o vídeo de apresentação de um projeto. */
export default function VideoModal({ open, onClose, src, poster, title }: Props) {
  const overlay = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement as HTMLElement | null;
    // Trava a rolagem da página enquanto o vídeo está aberto
    scroller.lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.fromTo(overlay.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: reduce ? 0 : 0.4, ease: "power2.out" });
    gsap.fromTo(
      panel.current,
      { y: 40, scale: 0.94, autoAlpha: 0 },
      { y: 0, scale: 1, autoAlpha: 1, duration: reduce ? 0 : 0.7, ease: "expo.out", delay: reduce ? 0 : 0.05 },
    );
    closeBtn.current?.focus();
    // Começa em volume médio; a pessoa pode aumentar pelos controles
    if (video.current) video.current.volume = 0.5;
    video.current?.play().catch(() => {});

    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      scroller.lenis?.start();
      document.documentElement.style.overflow = "";
      previousFocus?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      ref={overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Vídeo de apresentação: ${title}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="invisible fixed inset-0 z-[100] grid place-items-center bg-ink/90 p-4 backdrop-blur-md md:p-10"
    >
      <div ref={panel} className="w-full max-w-[1200px]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <p className="flex items-center gap-2.5 text-sm text-bone/80">
            <span className="size-1.5 rounded-full bg-ember" />
            {title} · Apresentação
          </p>
          <button
            ref={closeBtn}
            type="button"
            onClick={onClose}
            className="glass flex h-11 items-center gap-2 rounded-full px-4 text-sm text-bone transition-colors hover:bg-bone hover:text-ink"
          >
            Fechar
            <svg viewBox="0 0 16 16" aria-hidden="true" className="size-3.5">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <video
          ref={video}
          src={src}
          poster={poster}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full rounded-[20px] bg-black ring-1 ring-bone/10"
        />
      </div>
    </div>,
    document.body,
  );
}
