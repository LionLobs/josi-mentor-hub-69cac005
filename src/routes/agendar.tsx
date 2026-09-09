import { createFileRoute } from "@tanstack/react-router";
import { BookingWidget } from "@/components/booking-widget";
import { SUPPORT_ART } from "@/lib/course-art";
import { SUPPORT_PHONE, whatsappLink } from "@/lib/contact";
import { MessageCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/agendar")({
  head: () => ({
    meta: [
      { title: "Agende seu horário — Josi Nascimento" },
      { name: "description", content: "Escolha o serviço, o dia e o horário. Agendamento online com Josi Nascimento." },
      { property: "og:title", content: "Agende seu horário — Josi Nascimento" },
      { property: "og:description", content: "Escolha o serviço, o dia e o horário. Agendamento online com Josi Nascimento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PublicBooking,
});

function PublicBooking() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Imagem de fundo com tratamento dourado */}
      <img
        src={SUPPORT_ART.agenda}
        alt=""
        className="pointer-events-none fixed inset-0 h-full w-full object-cover object-center opacity-25"
      />
      {/* Vinheta esmeralda + dourada */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,oklch(0.8_0.13_85/0.18),transparent_55%),radial-gradient(circle_at_0%_100%,oklch(0.34_0.06_163/0.45),transparent_50%),radial-gradient(circle_at_100%_100%,oklch(0.34_0.06_163/0.35),transparent_45%),linear-gradient(to_bottom,oklch(0.08_0.02_165/0.55),oklch(0.08_0.02_165/0.92))]" />
      {/* Grade dourada sutil */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.8 0.13 85 / 0.35) 1px, transparent 1px), linear-gradient(90deg, oklch(0.8 0.13 85 / 0.35) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Ornamentos de canto */}
      <CornerOrnament position="top-left" />
      <CornerOrnament position="top-right" />
      <CornerOrnament position="bottom-left" />
      <CornerOrnament position="bottom-right" />

      <div className="relative mx-auto max-w-6xl px-4 py-10 md:py-16 lg:py-20">
        {/* Cabeçalho */}
        <header className="mb-10 text-center md:mb-14">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold">Josi Nascimento</span>
            <Sparkles className="h-3.5 w-3.5 text-gold" />
          </div>
          <h1 className="font-serif text-4xl text-white md:text-5xl lg:text-6xl">
            Agende seu <span className="italic text-gold">horário</span>
          </h1>
          <div className="mx-auto mt-5 flex max-w-md flex-col items-center gap-3">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent" />
            <p className="text-sm font-light leading-relaxed text-white/70 md:text-base">
              Escolha o serviço, o dia e o melhor horário para você. A confirmação chega pelo WhatsApp.
            </p>
          </div>
        </header>

        {/* Card principal do widget */}
        <div className="relative rounded-[2.5rem] border border-gold/30 bg-background/70 p-1 shadow-gold backdrop-blur-xl md:p-1.5">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
          <div className="rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-1 md:p-1.5">
            <BookingWidget kind="atendimento" />
          </div>
        </div>

        {/* Rodapé */}
        <footer className="mt-12 flex flex-col items-center gap-6 text-center md:mt-16">
          <a
            href={whatsappLink("Olá! Tenho uma dúvida sobre o agendamento.")}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-gold transition-all hover:border-gold hover:bg-gold hover:text-black"
          >
            <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" /> Dúvidas? WhatsApp {SUPPORT_PHONE}
          </a>
          <div className="space-y-2">
            <div className="mx-auto h-px w-32 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              © 2026 Josi Nascimento · Desenvolvido por <span className="text-gold">LIONLOBS</span>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function CornerOrnament({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const base = "pointer-events-none fixed z-0 h-24 w-24 opacity-40 md:h-36 md:w-36";
  const placement = {
    "top-left": "left-0 top-0",
    "top-right": "right-0 top-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  }[position];
  const rotate = {
    "top-left": "rotate-0",
    "top-right": "rotate-90",
    "bottom-left": "-rotate-90",
    "bottom-right": "rotate-180",
  }[position];

  return (
    <div className={`${base} ${placement}`}>
      <svg
        viewBox="0 0 100 100"
        className={`h-full w-full text-gold/60 ${rotate}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 0 H100 V100" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.4" />
        <path d="M0 0 L100 100" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" />
        <circle cx="6" cy="6" r="3" fill="currentColor" fillOpacity="0.35" />
        <circle cx="18" cy="18" r="1.5" fill="currentColor" fillOpacity="0.25" />
      </svg>
    </div>
  );
}
