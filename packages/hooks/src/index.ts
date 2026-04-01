import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { orpc } from "../../../apps/web/src/utils/orpc";
import { useState } from "react";

type ORPC = typeof orpc;

export function useTicket(orpc: ORPC) {
  const tickets = useQuery(orpc.ticket.list.queryOptions({}));
  const queryClient = useQueryClient();
  const addTicket = useMutation(
    orpc.ticket.create.mutationOptions({
      onMutate: (newTicket) => {
        queryClient.setQueryData(orpc.ticket.list.queryKey(), (old: unknown) => {
          const previousTickets = Array.isArray(old) ? old : [];

          return [
            ...previousTickets,
            {
              id: Math.random().toString(),
              ...newTicket,
              userId: "pending",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ];
        });
      },
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }),
  );
  const [description, setDescription] = useState("");

  return {
    tickets,
    description,
    setDescription,
    addTicket() {
      addTicket.mutate({ description });
      setDescription("");
    },
  };
}
