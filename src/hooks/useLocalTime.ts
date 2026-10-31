import { useEffect, useState } from "react";

const fmt = () =>
  new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" }).format(new Date());

/** Relógio ao vivo no horário de Brasília, atualizado a cada 10 segundos. */
export function useLocalTime() {
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setTime(fmt()), 10_000);
    return () => clearInterval(id);
  }, []);
  return time;
}
