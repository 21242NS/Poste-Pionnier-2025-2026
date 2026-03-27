import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { orpc } from "@/utils/orpc";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;


 function useTicket() {
  const tickets = useQuery(orpc.ticket.list.queryOptions());
  const queryClient = useQueryClient()
  const addTicket = useMutation(orpc.ticket.create.mutationOptions({
    onMutate: (newTicket) => {
      queryClient.setQueryData(orpc.ticket.list.queryKey(), (old) => [...(old || []), { id: Math.random().toString(), ...newTicket, userId: 'aaaa', createdAt: new Date(), updatedAt: new Date()  }]);
    },
    onSettled: () => {
     queryClient.invalidateQueries(); 
    }
  }));
  const [description, setDescription] = useState('')
  return { tickets, description, setDescription, addTicket() {
    addTicket.mutate({ description, userId: 'aaaa' });
    setDescription('');
  } };
}

function HomeComponent() {
  const { tickets, addTicket, description, setDescription } = useTicket()
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
