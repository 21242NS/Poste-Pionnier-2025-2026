
import { createFileRoute, redirect } from "@tanstack/react-router";

import { orpc } from "@/utils/orpc";
import { useTicket } from "hooks";
import { getUser } from "@/functions/get-user";


export const Route = createFileRoute("/ticket")({
  component: RouteComponent,
  beforeLoad: async () => {
      const session = await getUser();
      return { session };
    },
    loader: async ({ context }) => {
      if (!context.session) {
        throw redirect({
          to: "/login",
        });
      }
    },
});




function RouteComponent() {
  const { tickets, addTicket, description, setDescription } = useTicket(orpc)
  return (
   <div>
    <h1>Tickets</h1>
    {tickets.isLoading && <p>Loading...</p>}
    <ul>
      {tickets.data?.map((ticket) => (
        <li key={ticket.id}>{ticket.description}</li>
      ))}
    </ul>
    <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
    <button onClick={addTicket}>Add Ticket</button>
   </div>
  );
}
