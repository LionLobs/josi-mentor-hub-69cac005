import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { brl, dateTimeBR } from "@/lib/format";

export const Route = createFileRoute("/admin/agendamentos")({
  head: () => ({
    meta: [
      { title: "Agendamentos de serviços — Josi Nascimento" },
      { name: "description", content: "Marcações de clientes, situação do atendimento e do pagamento." },
      { property: "og:title", content: "Agendamentos de serviços — Josi Nascimento" },
      { property: "og:description", content: "Adicione, edite ou cancele agendamentos de clientes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <CrudPage
      table="bookings"
      title="Agendamentos"
      description="Clientes marcados na agenda de serviços."
      select="*, services(name)"
      orderBy={{ column: "starts_at", ascending: true }}
      columns={[
        { key: "full_name", label: "Cliente" },
        { key: "service", label: "Serviço", render: (r) => r["services"]?.name ?? "—" },
        { key: "starts_at", label: "Data e hora", render: (r) => dateTimeBR(r["starts_at"]) },
        { key: "duration_min", label: "Min." },
        { key: "status", label: "Situação" },
        { key: "payment_status", label: "Pagamento" },
        { key: "amount_cents", label: "Valor", render: (r) => brl(r["amount_cents"]) },
      ]}
      fields={[
        { name: "full_name", label: "Nome da cliente", required: true },
        { name: "email", label: "E-mail", required: true },
        { name: "phone", label: "WhatsApp" },
        {
          name: "service_id",
          label: "Serviço",
          type: "select",
          optionsFrom: { table: "services", labelKey: "name" },
        },
        { name: "starts_at", label: "Data e hora", type: "datetime", required: true },
        { name: "duration_min", label: "Duração (min)", type: "number", defaultValue: 60 },
        {
          name: "status",
          label: "Situação",
          type: "select",
          defaultValue: "agendado",
          options: [
            { value: "agendado", label: "Agendado" },
            { value: "concluido", label: "Concluído" },
            { value: "cancelado", label: "Cancelado" },
          ],
        },
        {
          name: "payment_status",
          label: "Pagamento",
          type: "select",
          defaultValue: "pendente",
          options: [
            { value: "pendente", label: "Pendente" },
            { value: "pago", label: "Pago" },
            { value: "isento", label: "Isento" },
          ],
        },
        {
          name: "payment_method",
          label: "Forma de pagamento",
          type: "select",
          options: [
            { value: "pix", label: "PIX" },
            { value: "cartao", label: "Cartão" },
            { value: "dinheiro", label: "Dinheiro" },
            { value: "link", label: "Link de checkout" },
          ],
        },
        { name: "amount_cents", label: "Valor (R$)", type: "money", defaultValue: 0 },
        { name: "notes", label: "Anotações", type: "textarea" },
      ]}
    />
  ),
});
