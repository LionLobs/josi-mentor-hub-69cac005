import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Video, Sparkles, Clock, ShieldCheck } from "lucide-react";
import { BookingWidget } from "@/components/booking-widget";
import { SUPPORT_ART } from "@/lib/course-art";
import { SUPPORT_PHONE, whatsappLink } from "@/lib/contact";

export const Route = createFileRoute("/aluno/call")({
  head: () => ({
    meta: [
      { title: "Call de Mentoria — Josi Nascimento" },
      { name: "description", content: "Agende sua call individual de mentoria com a Josi Nascimento." },
      { property: "og:title", content: "Call de Mentoria — Josi Nascimento" },
      { property: "og:description", content: "Escolha o melhor dia e horário para sua sessão individual." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MentoringCall,
});

function MentoringCall() {
  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-gold/20 p-6 md:p-12"
      >
        <img src={SUPPORT_ART.destaque} alt="" className="absolute inset-0 h-full w-full object-cover object-top opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="relative max-w-xl">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
            <Sparkles className="h-3 w-3" /> Exclusivo da mentoria
          </p>
          <h1 className="font-serif text-3xl leading-tight text-white md:text-5xl">
            Sua <span className="italic text-gold">call</span> individual com a Josi
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
            Uma conversa online de 45 minutos para revisar sua jornada, ajustar o posicionamento e definir os próximos passos do seu plano de ação.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-widest text-white/50">
            <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5"><Clock className="h-3 w-3 text-gold" /> 45 minutos</span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5"><Video className="h-3 w-3 text-gold" /> Online</span>
            <span className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5"><ShieldCheck className="h-3 w-3 text-gold" /> Incluso no programa</span>
          </div>
        </div>
      </motion.section>

      <BookingWidget kind="mentoria" />

      <div className="rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/15 to-transparent p-6 text-center md:p-8">
        <h3 className="font-serif text-xl text-white">Precisa remarcar sua call?</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
          Avise com no mínimo 48h de antecedência pelo WhatsApp {SUPPORT_PHONE}.
        </p>
        <a
          href={whatsappLink("Olá! Preciso remarcar minha call de mentoria.")}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-gold px-8 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
        >
          Falar no WhatsApp
        </a>
      </div>
    </div>
  );
}
