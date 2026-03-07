import CreateTicketForm from "../../../_components/CreateTicketForm";

type Props = {
  searchParams: Promise<{ type?: string }>;
};

export default async function AdminNewTicketPage({ searchParams }: Props) {
  const params = await searchParams;
  const defaultType = params.type === "subscription" ? "SUBSCRIPTION" : "";
  return <CreateTicketForm defaultType={defaultType} />;
}
