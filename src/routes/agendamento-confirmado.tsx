import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Check, Calendar, Clock, Tag, CreditCard, QrCode, ShieldCheck, ExternalLink,
  Video, MessageCircle, Sparkles, ArrowLeft,
} from "lucide-react";
import { brl } from "@/lib/format";
import { whatsappLink } from "@/lib/contact";
import josiBg from "@/assets/josi-25.jpg";

type ConfirmSearch = {
  servico?: string | undefined;
  inicio?: string | undefined;
  duracao?: number | undefined;
  valor?: number | undefined;
  metodo?: string | undefined;
  meet?: string | undefined;
  checkout?: string | undefined;
};

export const Route = createFileRoute("/agendamento-confirmado")({
  validateSearch: (search: Record<string, unknown>): ConfirmSearch => ({
    servico: typeof search["servico"] === "string" ? search["servico"] : undefined,
    inicio: typeof search["inicio"] === "string" ? search["inicio"] : undefined,
    duracao: typeof search["duracao"] === "number" ? search["duracao"] : undefined,
    valor: typeof search["valor"] === "number" ? search["valor"] : undefined,
    metodo: typeof search["metodo"] === "string" ? search["metodo"] : undefined,
    meet: typeof search["meet"] === "string" ? search["meet"] : undefined,
    checkout: typeof search["checkout"] === "string" ? search["checkout"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Agendamento Confirmado — Josi Nascimento" },
      { name: "description", content: "Seu horário foi reservado. Confira o resumo e os próximos passos de pagamento." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Agendamento Confirmado — Josi Nascimento" },
      { property: "og:description", content: "Seu horário foi reservado com sucesso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AgendamentoConfirmado,
});

function AgendamentoConfirmado() {
  const s = Route.useSearch();

  if (!s.servico || !s.inicio) {
    return (
      <Shell>
        <div className="text-center">
          <Calendar className="mx-auto mb-4 h-10 w-10 text-gold/60" />
          <h1 className="font-serif text-2xl text-white">Nenhum agendamento por aqui</h1>
          <p className="mt-2 text-sm text-white/50">Escolha um serviço e um horário para reservar seu atendimento.</p>
          <Link
            to="/agendar"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
          >
            <ArrowLeft className="h-4 w-4" /> Agendar um horário
          </Link>
        </div>
      </Shell>
    );
  }

  const when = new Date(s.inicio);
  const whenLabel = when.toLocaleString("pt-BR", {
    weekday: "long", day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit",
  });
  const amount = s.valor ?? 0;
  const pixMsg = `Olá! Agendei ${s.servico} para ${whenLabel}. Quero pagar via Pix (${brl(amount)}).`;
  const confirmMsg = `Olá! Confirmando meu agendamento: ${s.servico} em ${whenLabel}.${s.meet ? ` Sala do Meet: ${s.meet}` : ""}`;

  return (
    <Shell>
      <div className="mx-auto max-w-xl">
        {/* Cabeçalho */}
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gold shadow-gold-md">
            <Check className="h-8 w-8 text-black" strokeWidth={3} />
          </div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Reserva concluída</p>
          <h1 className="font-serif text-3xl text-white md:text-4xl">
            Agendamento <span className="italic text-gold">confirmado</span>
          </h1>
          <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
        </div>

        {/* Resumo */}
        <div className="mt-8 rounded-[1.5rem] border border-gold/25 bg-gradient-to-b from-gold/[0.10] to-white/[0.03] p-6 backdrop-blur-xl">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold">
            <Sparkles className="h-3.5 w-3.5" /> Resumo do seu horário
          </div>
          <h2 className="mt-3 font-serif text-2xl leading-tight text-white">{s.servico}</h2>
          <div className="mt-4 space-y-2.5 text-sm text-white/70">
            <p className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 shrink-0 text-gold" />
              <span className="capitalize">{whenLabel}</span>
            </p>
            {s.duracao ? (
              <p className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 shrink-0 text-gold" /> {s.duracao} minutos com Josi Nascimento
              </p>
            ) : null}
            <p className="flex items-center gap-2.5">
              <Tag className="h-4 w-4 shrink-0 text-gold" />
              {amount > 0 ? <span className="font-serif text-xl text-gold">{brl(amount)}</span> : "Incluso na mentoria"}
            </p>
          </div>
        </div>

        {/* Pagamento */}
        {amount > 0 && (
          <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/50">Próximo passo · pagamento</span>
              <span className="rounded-full border border-gold/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">Pendente</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/55">
              Para garantir seu horário, finalize o pagamento por um dos canais abaixo. Seu horário fica reservado enquanto isso.
            </p>
            <div className="mt-5 space-y-3">
              {s.metodo === "cartao" && s.checkout ? (
                <a
                  href={s.checkout}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
                >
                  <CreditCard className="h-4 w-4" /> Pagar com cartão <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
              <a
                href={whatsappLink(pixMsg)}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 py-3.5 text-xs font-bold uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-black"
              >
                <QrCode className="h-4 w-4" /> Receber chave Pix no WhatsApp
              </a>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-white/30">
              <ShieldCheck className="h-3 w-3 text-gold" /> Pagamento protegido
            </p>
          </div>
        )}

        {/* Sala do Meet */}
        {s.meet && (
          <div className="mt-5 rounded-[1.5rem] border border-gold/25 bg-gold/[0.07] p-6 backdrop-blur-xl">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Sala da sua call</p>
            <p className="mt-2 text-xs leading-relaxed text-white/55">
              O horário já está na agenda da Josi e a sala do Google Meet foi criada para você.
            </p>
            <a
              href={s.meet}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
            >
              <Video className="h-4 w-4" /> Entrar no Google Meet
            </a>
          </div>
        )}

        {/* WhatsApp */}
        <a
          href={whatsappLink(confirmMsg)}
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 py-3.5 text-xs font-bold uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-black"
        >
          <MessageCircle className="h-4 w-4" /> Enviar confirmação no WhatsApp
        </a>

        <div className="mt-8 text-center">
          <Link
            to="/agendar"
            className="text-[10px] font-bold uppercase tracking-widest text-white/40 transition-colors hover:text-gold"
          >
            Fazer outro agendamento
          </Link>
        </div>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0f0a]">
      <img src={josiBg} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.14]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0f0a]/70 via-[#0a0f0a]/85 to-[#0a0f0a]" />
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-gold/10 blur-[120px]" />
      <div className="relative mx-auto max-w-3xl px-5 py-14 md:py-20">{children}</div>
      <p className="relative pb-8 text-center text-[10px] uppercase tracking-widest text-white/30">
        © 2026 Josi Nascimento · Desenvolvido por <span className="text-[#e8c37a]">LIONLOBS</span>
      </p>
    </div>
  );
}
