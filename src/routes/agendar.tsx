import { createFileRoute } from "@tanstack/react-router";
import { BookingWidget } from "@/components/booking-widget";
import { SUPPORT_ART } from "@/lib/course-art";
import { SUPPORT_PHONE, whatsappLink } from "@/lib/contact";
import { MessageCircle } from "lucide-react";

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
    <div className="relative min-h-screen bg-background">
      <img
        src={SUPPORT_ART.agenda}
        alt=""
        className="pointer-events-none fixed inset-0 h-full w-full object-cover object-top opacity-15"
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-background/70 via-background to-background" />

      <div className="relative mx-auto max-w-5xl px-4 py-10 md:py-16">
        <header className="mb-10 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.5em] text-gold">Josi Nascimento</p>
          <h1 className="font-serif text-4xl text-white md:text-5xl">
            Agende seu <span className="italic text-gold">horário</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-white/50">
            Escolha o serviço, o dia e o melhor horário para você. A confirmação chega pelo WhatsApp.
          </p>
        </header>

        <BookingWidget kind="atendimento" />

        <footer className="mt-12 text-center">
          <a
            href={whatsappLink("Olá! Tenho uma dúvida sobre o agendamento.")}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-6 py-3 text-xs font-bold uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-black"
          >
            <MessageCircle className="h-4 w-4" /> Dúvidas? WhatsApp {SUPPORT_PHONE}
          </a>
          <p className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-white/25">
            © 2026 Josi Nascimento · Desenvolvido por <span className="text-gold/60">LIONLOBS</span>
          </p>
        </footer>
      </div>
    </div>
  );
}
