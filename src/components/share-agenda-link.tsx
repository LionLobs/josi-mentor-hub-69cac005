import { Link2, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ShareAgendaLink() {
  const [copied, setCopied] = useState(false);
  const url = `${typeof window !== "undefined" ? window.location.origin : ""}/agendar`;
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 rounded-3xl border border-gold/25 bg-gradient-to-r from-gold/15 to-transparent p-6 md:flex-row md:items-center">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">Link público de agendamento</p>
        <p className="mt-1 text-sm text-white/60">
          Compartilhe com suas clientes: <span className="font-mono text-gold break-all">{url}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-gold/40 px-5 py-3 text-xs font-bold uppercase tracking-widest text-gold transition-all hover:bg-gold/10"
        >
          Abrir página
        </a>
        <button
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              toast.success("Link copiado!");
              setTimeout(() => setCopied(false), 2000);
            } catch {
              toast.error("Não foi possível copiar.");
            }
          }}
          className="flex items-center gap-2 rounded-xl bg-gold px-5 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
        >
          {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          {copied ? "Copiado" : "Copiar link"}
        </button>
      </div>
    </div>
  );
}
