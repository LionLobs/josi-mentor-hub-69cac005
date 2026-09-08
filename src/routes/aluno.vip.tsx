import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Crown, Sparkles, CalendarHeart, Gift, ShieldCheck, MessageCircle, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SUPPORT_ART } from "@/lib/course-art";
import { whatsappLink } from "@/lib/contact";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/aluno/vip")({
  head: () => ({
    meta: [
      { title: "Área VIP — Josi Nascimento" },
      { name: "description", content: "Benefícios exclusivos, planos de massagem e atendimento prioritário para clientes VIP." },
      { property: "og:title", content: "Área VIP — Josi Nascimento" },
      { property: "og:description", content: "Planos mensal, trimestral e anual com vantagens exclusivas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: VipArea,
});

const PERIOD_LABEL: Record<string, string> = {
  mensal: "Todo mês",
  trimestral: "A cada 3 meses",
  anual: "Durante 12 meses",
};

const BENEFITS = [
  { icon: CalendarHeart, title: "Horários prioritários", text: "Sua vaga na agenda é reservada antes da abertura para o público." },
  { icon: Gift, title: "Valores exclusivos", text: "Condições especiais nos pacotes e nas sessões avulsas." },
  { icon: Sparkles, title: "Conteúdos premium", text: "Aulas e materiais liberados só para quem é VIP." },
  { icon: MessageCircle, title: "Atendimento direto", text: "Canal reservado no WhatsApp com resposta prioritária." },
];

function VipArea() {
  const { data: isVip = false, isLoading: loadingStatus } = useQuery({
    queryKey: ["meu-vip"],
    queryFn: async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) return false;
      const { data } = await supabase
        .from("students")
        .select("vip")
        .eq("profile_id", auth.user.id)
        .maybeSingle();
      return Boolean(data?.vip);
    },
  });

  const { data: plans = [] } = useQuery({
    queryKey: ["planos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, description, price_cents, billing_period, checkout_url, sort_order")
        .eq("active", true)
        .eq("kind", "plano")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-10">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] border border-gold/25 p-6 md:p-12"
      >
        <img src={SUPPORT_ART.destaque} alt="" className="absolute inset-0 h-full w-full object-cover object-top opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent" />
        <div className="relative max-w-xl">
          <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
            <Crown className="h-3 w-3" /> {loadingStatus ? "Carregando" : isVip ? "Você é VIP" : "Clube VIP"}
          </p>
          <h1 className="font-serif text-3xl leading-tight text-white md:text-5xl">
            Área <span className="italic text-gold">VIP</span> Josi Nascimento
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/60 md:text-base">
            {isVip
              ? "Todos os seus benefícios exclusivos, planos de massagem e atendimento prioritário reunidos aqui."
              : "Um espaço reservado para clientes com plano ativo: horários prioritários, valores exclusivos e conteúdos premium."}
          </p>
          {!isVip && !loadingStatus && (
            <a
              href={whatsappLink("Olá! Quero fazer parte do clube VIP da Josi.")}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
            >
              <Crown className="h-4 w-4" /> Quero ser VIP
            </a>
          )}
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {BENEFITS.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-gold/10 to-transparent p-5"
          >
            <b.icon className="h-5 w-5 text-gold" />
            <h3 className="mt-3 font-serif text-lg text-white">{b.title}</h3>
            <p className="mt-1 text-xs leading-relaxed text-white/50">{b.text}</p>
          </motion.div>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold">Planos de massagem</p>
            <h2 className="font-serif text-2xl text-white md:text-3xl">Mensal, trimestral e anual</h2>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.id}
              className="flex flex-col rounded-[1.75rem] border border-gold/25 bg-gradient-to-b from-gold/[0.12] to-transparent p-6"
            >
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gold">
                <Clock className="h-3 w-3" /> {PERIOD_LABEL[p.billing_period ?? ""] ?? "Plano"}
              </p>
              <h3 className="mt-3 font-serif text-xl leading-tight text-white">{p.name}</h3>
              <p className="mt-2 flex-1 text-xs leading-relaxed text-white/50">{p.description}</p>
              <p className="mt-5 font-serif text-2xl text-gold">
                {p.price_cents > 0 ? brl(p.price_cents) : "Valor sob consulta"}
              </p>
              <a
                href={
                  p.price_cents > 0 && p.checkout_url
                    ? p.checkout_url
                    : whatsappLink(`Olá! Quero saber sobre o ${p.name}.`)
                }
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-gold py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
              >
                {p.price_cents > 0 && p.checkout_url ? "Assinar plano" : "Falar com a Josi"}
              </a>
            </div>
          ))}
          {plans.length === 0 && (
            <p className="text-sm text-white/40">Os planos aparecerão aqui assim que forem publicados.</p>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/15 to-transparent p-6 text-center md:p-8">
        <ShieldCheck className="mx-auto h-6 w-6 text-gold" />
        <h3 className="mt-3 font-serif text-xl text-white">Atendimento VIP direto com a Josi</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/60">
          Dúvidas sobre planos, renovação ou horários especiais? Fale agora pelo WhatsApp.
        </p>
        <a
          href={whatsappLink("Olá! Falando pela Área VIP da plataforma.")}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-block rounded-full bg-gold px-8 py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
        >
          Falar no WhatsApp
        </a>
      </section>
    </div>
  );
}
