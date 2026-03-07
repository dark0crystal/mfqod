import TicketDetail from "../../../_components/TicketDetail";

type Props = {
  params: Promise<{ ticketId: string }>;
};

export default async function AdminTicketDetailPage({ params }: Props) {
  const { ticketId } = await params;
  return <TicketDetail ticketId={ticketId} canClose />;
}
