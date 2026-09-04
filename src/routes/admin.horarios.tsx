import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";

const WEEKDAYS = [
  { value: "0", label: "Domingo" },
  { value: "1", label: "Segunda-feira" },
  { value: "2", label: "Terça-feira" },
  { value: "3", label: "Quarta-feira" },
  { value: "4", label: "Quinta-feira" },
  { value: "5", label: "Sexta-feira" },
  { value: "6", label: "Sábado" },
];

export const Route = createFileRoute("/admin/horarios")({
  head: () => ({
    meta: [
      { title: "Horários disponíveis — Josi Nascimento" },
      { name: "description", content: "Defina os dias e horários em que a agenda online aceita marcações." },
      { property: "og:title", content: "Horários disponíveis — Josi Nascimento" },
      { property: "og:description", content: "Configuração de janelas de atendimento da agenda online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <CrudPage
      table="availability_rules"
      title="Horários disponíveis"
      description="Dias e faixas de horário em que as clientes podem marcar."
      orderBy={{ column: "weekday", ascending: true }}
      columns={[
        {
          key: "weekday",
          label: "Dia",
          render: (r) => WEEKDAYS.find((d) => Number(d.value) === Number(r["weekday"]))?.label ?? "—",
        },
        { key: "start_time", label: "Início", render: (r) => String(r["start_time"]).slice(0, 5) },
        { key: "end_time", label: "Fim", render: (r) => String(r["end_time"]).slice(0, 5) },
        { key: "slot_min", label: "Intervalo", render: (r) => `${r["slot_min"]} min` },
        { key: "active", label: "Ativo", render: (r) => (r["active"] ? "Sim" : "Não") },
      ]}
      fields={[
        { name: "weekday", label: "Dia da semana", type: "select", options: WEEKDAYS, required: true },
        { name: "start_time", label: "Início", type: "time", required: true },
        { name: "end_time", label: "Fim", type: "time", required: true },
        { name: "slot_min", label: "Intervalo entre horários (min)", type: "number", defaultValue: 60 },
        { name: "active", label: "Ativo", type: "checkbox", defaultValue: true },
      ]}
    />
  ),
});
