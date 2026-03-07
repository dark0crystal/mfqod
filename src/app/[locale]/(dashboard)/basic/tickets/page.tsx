import TicketList from "../../_components/TicketList";

export default function BasicTicketsPage() {
  return (
    <TicketList
      showAuthor={false}
      title="My tickets"
      emptyMessage="You have no tickets yet. Create one from the link below or from the pricing page."
    />
  );
}
