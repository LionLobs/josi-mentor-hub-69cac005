import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/crud-page";
import { brl } from "@/lib/format";

export const Route = createFileRoute("/admin/servicos")({
  head: () => ({
    meta: [
      { title: "Serviços da agenda — Josi Nascimento" },
      { name: "description", content: "Cadastro de serviços, valores e pacotes oferecidos na agenda online." },
      { property: "og:title", content: "Serviços da agenda — Josi Nascimento" },
      { property: "og:description", content: "Adicione, edite e desative serviços da agenda online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <CrudPage
      table="services"
      title="Serviços"
      description="O que aparece para as clientes na agenda online."
      orderBy={{ column: "sort_order", ascending: true }}
      columns={[
        { key: "name", label: "Serviço" },
        { key: "duration_min", label: "Duração", render: (r) => `${r["duration_min"]} min` },
        { key: "price_cents", label: "Valor", render: (r) => brl(r["price_cents"]) },
        { key: "package_label", label: "Pacote" },
        { key: "kind", label: "Tipo" },
        { key: "active", label: "Ativo", render: (r) => (r["active"] ? "Sim" : "Não") },
      ]}
      fields={[
        { name: "name", label: "Nome do serviço", required: true },
        { name: "description", label: "Descrição", type: "textarea" },
        {
          name: "kind",
          label: "Tipo",
          type: "select",
          defaultValue: "atendimento",
          options: [
            { value: "atendimento", label: "Atendimento" },
            { value: "mentoria", label: "Call de mentoria" },
          ],
        },
        { name: "duration_min", label: "Duração (min)", type: "number", defaultValue: 60, required: true },
        { name: "price_cents", label: "Valor (R$)", type: "money", required: true },
        { name: "package_label", label: "Nome do pacote (opcional)" },
        { name: "package_price_cents", label: "Valor do pacote (R$)", type: "money" },
        { name: "discount_note", label: "Observação de desconto" },
        { name: "checkout_url", label: "Link de pagamento (checkout)" },
        { name: "sort_order", label: "Ordem de exibição", type: "number", defaultValue: 0 },
        { name: "active", label: "Disponível na agenda", type: "checkbox", defaultValue: true },
      ]}
    />
  ),
});
