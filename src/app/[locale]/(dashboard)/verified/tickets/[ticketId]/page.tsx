import TicketDetail from "../../../_components/TicketDetail";

type Props = {
  params: Promise<{ ticketId: string }>;
};

export default async function VerifiedTicketDetailPage({ params }: Props) {
  const { ticketId } = await params;
  return <TicketDetail ticketId={ticketId} canReopen />;
}
