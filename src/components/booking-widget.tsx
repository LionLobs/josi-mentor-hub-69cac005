import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, CalendarX2, ChevronLeft, ChevronRight, Clock, Tag, User, Check, Loader2,
  CreditCard, QrCode, ShieldCheck, ExternalLink,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { brl } from "@/lib/format";
import { whatsappLink } from "@/lib/contact";
import { toast } from "sonner";

type Service = {
  id: string;
  name: string;
  duration_min: number;
  price_cents: number;
  package_label: string | null;
  package_price_cents: number | null;
  discount_note: string | null;
  checkout_url?: string | null;
  description?: string | null;
};

type PaymentMethod = "pix" | "cartao" | "presencial";

const WEEKDAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

const toISODate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function buildMonth(cursor: Date) {
  const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const blanks = first.getDay();
  return {
    blanks: Array.from({ length: blanks }, (_, i) => i),
    days: Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  };
}

const METHODS: { id: PaymentMethod; label: string; note: string; icon: typeof QrCode }[] = [
  { id: "pix", label: "Pix", note: "15% off · confirmação rápida", icon: QrCode },
  { id: "cartao", label: "Cartão", note: "Checkout seguro online", icon: CreditCard },
  { id: "presencial", label: "No atendimento", note: "Pagar no dia da sessão", icon: Tag },
];

export function BookingWidget({ kind = "atendimento" }: { kind?: "atendimento" | "mentoria" }) {
  const queryClient = useQueryClient();
  const [service, setService] = useState<Service | null>(null);
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(() => new Date());
  const [slot, setSlot] = useState<string | null>(null);
  const [method, setMethod] = useState<PaymentMethod>("pix");
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", notes: "" });
  const [confirmed, setConfirmed] = useState<{ starts_at: string; service: Service; method: PaymentMethod } | null>(null);

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["services", kind],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("id, name, duration_min, price_cents, package_label, package_price_cents, discount_note, checkout_url, description, kind")
        .eq("active", true)
        .eq("kind", kind)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Service[];
    },
  });

  const dayKey = toISODate(selectedDay);
  const { data: slots = [], isLoading: loadingSlots } = useQuery({
    queryKey: ["slots", dayKey, service?.duration_min],
    enabled: !!service,
    queryFn: async () => {
      const { data, error } = await supabase.rpc("available_slots", {
        _day: dayKey,
        _duration_min: service?.duration_min ?? 60,
      });
      if (error) throw error;
      return (data ?? []).map((r: { slot: string }) => r.slot);
    },
  });

  const price = service?.price_cents ?? 0;
  const needsPayment = price > 0;

  const book = useMutation({
    mutationFn: async () => {
      if (!service || !slot) throw new Error("Selecione um horário.");
      const { data: auth } = await supabase.auth.getUser();
      const user = auth.user;
      const chosen: PaymentMethod = needsPayment ? method : "presencial";
      const { error } = await supabase.from("bookings").insert({
        service_id: service.id,
        user_id: user?.id ?? null,
        full_name: form.full_name.trim(),
        email: form.email.trim() || user?.email || "",
        phone: form.phone.trim() || null,
        starts_at: slot,
        duration_min: service.duration_min,
        notes: form.notes.trim() || null,
        amount_cents: price,
        payment_method: chosen,
        payment_status: needsPayment ? "pendente" : "isento",
      });
      if (error) throw error;
      return { starts_at: slot, service, method: chosen };
    },
    onSuccess: (res) => {
      toast.success("Agendamento confirmado!");
      setConfirmed(res);
      setSlot(null);
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["meus-agendamentos"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Não foi possível agendar."),
  });

  const { blanks, days } = useMemo(() => buildMonth(cursor), [cursor]);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const reset = () => {
    setConfirmed(null);
    setService(null);
    setSlot(null);
    setForm({ full_name: "", email: "", phone: "", notes: "" });
  };

  /* ---------- Checkout / confirmação ---------- */
  if (confirmed) {
    const when = new Date(confirmed.starts_at).toLocaleString("pt-BR", {
      day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit",
    });
    const amount = confirmed.service.price_cents;
    const pixMsg = `Olá! Agendei ${confirmed.service.name} para ${when}. Quero pagar via Pix (${brl(amount)}).`;
    return (
      <div className="rounded-[2rem] border border-gold/25 bg-gradient-to-br from-gold/10 to-transparent p-6 text-center md:p-10">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-black">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="font-serif text-3xl text-white">Agendamento confirmado</h2>
        <p className="mt-2 text-sm text-white/60">
          {confirmed.service.name} · {when}
        </p>

        {amount > 0 ? (
          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">Total</span>
              <span className="font-serif text-2xl text-gold">{brl(amount)}</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-white/50">
              Pagamento <strong className="text-white/80">pendente</strong>. Finalize abaixo para garantir o horário.
            </p>
            <div className="mt-5 space-y-3">
              {confirmed.method === "cartao" && confirmed.service.checkout_url ? (
                <a
                  href={confirmed.service.checkout_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white"
                >
                  <CreditCard className="h-4 w-4" /> Pagar com cartão <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
              <a
                href={whatsappLink(pixMsg)}
                target="_blank"
                rel="noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-gold/40 py-3 text-xs font-bold uppercase tracking-widest text-gold transition-all hover:bg-gold hover:text-black"
              >
                <QrCode className="h-4 w-4" /> Receber chave Pix
              </a>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest text-white/30">
              <ShieldCheck className="h-3 w-3 text-gold" /> Pagamento protegido
            </p>
          </div>
        ) : (
          <p className="mt-6 text-sm text-white/50">Sua call de mentoria está incluída no programa. O link será enviado por e-mail.</p>
        )}

        <button
          onClick={reset}
          className="mt-8 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-gold"
        >
          Fazer outro agendamento
        </button>
      </div>
    );
  }

  /* ---------- Lista de serviços ---------- */
  if (!service) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl md:p-10">
        <div className="mb-8 text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-gold">
            {kind === "mentoria" ? "Mentoria" : "Atendimentos"}
          </p>
          <h2 className="font-serif text-2xl text-white md:text-3xl">
            {kind === "mentoria" ? <>Agende sua <span className="italic text-gold">call</span></> : <>Escolha o seu <span className="italic text-gold">serviço</span></>}
          </h2>
        </div>
        {loadingServices ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/5" />)}
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-sm text-white/40">Nenhum serviço disponível no momento.</p>
        ) : (
          <div className="mx-auto max-w-2xl space-y-3">
            {services.map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.03, 0.4) }}
                onClick={() => { setService(s); setSlot(null); }}
                className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-gold/25 bg-gradient-to-r from-gold/15 to-gold/5 px-4 py-4 text-left transition-all hover:border-gold/60 hover:from-gold/25 md:px-5"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium text-white transition-colors group-hover:text-gold">{s.name}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/35">
                    {s.duration_min} min {s.price_cents > 0 ? `· ${brl(s.price_cents)}` : "· incluso"}
                  </span>
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gold" />
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] backdrop-blur-xl">
      <div className="grid lg:grid-cols-[280px_1fr_320px]">
        {/* Resumo do serviço */}
        <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
          <button
            onClick={() => { setService(null); setSlot(null); }}
            className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gold transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <p className="text-xs uppercase tracking-widest text-white/40">Josi Nascimento</p>
          <h3 className="mt-1 font-serif text-2xl leading-tight text-white">{service.name}</h3>

          <div className="mt-6 space-y-3 text-sm">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/40">1 sessão</p>
              <p className="font-medium text-white">{price > 0 ? brl(price) : "Incluso na mentoria"}</p>
              {service.discount_note && <p className="text-[11px] text-gold">{service.discount_note}</p>}
            </div>
            {service.package_price_cents && (
              <div className="rounded-xl border border-gold/20 bg-gold/5 p-3">
                <p className="text-[10px] uppercase tracking-widest text-gold">{service.package_label}</p>
                <p className="font-medium text-white">{brl(service.package_price_cents)}</p>
                <p className="text-[11px] text-white/50">15% Off no pix ou dinheiro</p>
              </div>
            )}
          </div>

          <div className="mt-6 space-y-2 text-sm text-white/60">
            <p className="flex items-center gap-2"><User className="h-4 w-4 text-gold" /> Josi Nascimento</p>
            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /> {service.duration_min} min</p>
            {price > 0 && <p className="flex items-center gap-2"><Tag className="h-4 w-4 text-gold" /> {brl(price)}</p>}
          </div>
        </div>

        {/* Calendário */}
        <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
          <div className="mb-4 flex items-center justify-between">
            <p className="font-serif text-lg capitalize text-white">
              {cursor.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { const d = new Date(); setCursor(d); setSelectedDay(d); }}
                className="text-xs font-bold uppercase tracking-widest text-gold hover:text-white"
              >Hoje</button>
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
                className="rounded-full border border-white/10 p-1.5 text-white/60 hover:border-gold/40 hover:text-gold"
              ><ChevronLeft className="h-4 w-4" /></button>
              <button
                onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
                className="rounded-full border border-white/10 p-1.5 text-white/60 hover:border-gold/40 hover:text-gold"
              ><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase tracking-widest text-white/35">
            {WEEKDAYS.map(d => <span key={d} className="py-2">{d}</span>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {blanks.map(b => <span key={`b${b}`} />)}
            {days.map(d => {
              const isPast = d < today;
              const isSelected = toISODate(d) === toISODate(selectedDay);
              return (
                <button
                  key={d.toISOString()}
                  disabled={isPast}
                  onClick={() => { setSelectedDay(d); setSlot(null); }}
                  className={[
                    "aspect-square rounded-full text-sm transition-all",
                    isPast ? "cursor-not-allowed text-white/15" : "text-white/80 hover:bg-white/10",
                    isSelected ? "bg-gold font-bold text-black hover:bg-gold" : "",
                  ].join(" ")}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Horários + checkout */}
        <div className="p-6">
          <p className="text-center font-serif text-white">
            {selectedDay.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p className="mt-1 text-center text-[10px] uppercase tracking-widest text-white/35">Exibindo horários para Josi</p>

          <AnimatePresence mode="wait">
            {loadingSlots ? (
              <div className="mt-6 space-y-2">
                {[1, 2, 3].map(i => <div key={i} className="h-10 animate-pulse rounded-xl bg-white/5" />)}
              </div>
            ) : slots.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-12 text-center">
                <CalendarX2 className="mx-auto mb-3 h-8 w-8 text-white/15" />
                <p className="text-sm text-white/40">Nenhum horário para esta data.</p>
              </motion.div>
            ) : (
              <motion.div key="slots" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 grid grid-cols-2 gap-2">
                {slots.map((s: string) => (
                  <button
                    key={s}
                    onClick={() => setSlot(s)}
                    className={[
                      "rounded-xl border py-2.5 text-sm font-medium transition-all",
                      slot === s
                        ? "border-gold bg-gold text-black"
                        : "border-white/10 bg-white/5 text-white/80 hover:border-gold/50 hover:text-gold",
                    ].join(" ")}
                  >
                    {new Date(s).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {slot && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={(e) => { e.preventDefault(); book.mutate(); }}
              className="mt-6 space-y-3 border-t border-white/10 pt-6"
            >
              <input
                required
                placeholder="Seu nome completo"
                value={form.full_name}
                onChange={e => setForm({ ...form, full_name: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-gold/60 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Seu e-mail"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-gold/60 focus:outline-none"
              />
              <input
                placeholder="WhatsApp"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-gold/60 focus:outline-none"
              />
              <textarea
                rows={2}
                placeholder="Observações (opcional)"
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-gold/60 focus:outline-none"
              />

              {needsPayment && (
                <div className="rounded-2xl border border-gold/20 bg-gold/[0.06] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gold">Forma de pagamento</p>
                    <p className="font-serif text-lg text-white">{brl(price)}</p>
                  </div>
                  <div className="space-y-2">
                    {METHODS.map(m => (
                      <button
                        type="button"
                        key={m.id}
                        onClick={() => setMethod(m.id)}
                        className={[
                          "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all",
                          method === m.id
                            ? "border-gold bg-gold/15"
                            : "border-white/10 bg-white/5 hover:border-gold/40",
                        ].join(" ")}
                      >
                        <m.icon className={method === m.id ? "h-4 w-4 text-gold" : "h-4 w-4 text-white/40"} />
                        <span className="min-w-0">
                          <span className="block text-sm text-white">{m.label}</span>
                          <span className="block text-[10px] uppercase tracking-widest text-white/35">{m.note}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={book.isPending}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3 text-xs font-bold uppercase tracking-widest text-black transition-all hover:bg-white disabled:opacity-60"
              >
                {book.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                {needsPayment ? `Agendar e pagar · ${brl(price)}` : "Confirmar agendamento"}
              </button>
              <p className="flex items-center justify-center gap-2 text-[9px] uppercase tracking-widest text-white/25">
                <ShieldCheck className="h-3 w-3 text-gold/70" /> Seus dados estão protegidos
              </p>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
}
