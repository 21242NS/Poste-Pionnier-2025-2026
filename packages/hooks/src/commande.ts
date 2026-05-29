import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { orpc } from "../../../apps/web/src/utils/orpc";
import { useState } from "react";

type ORPC = typeof orpc;

export function useCommand(orpc: ORPC) {
  const commands = useQuery(orpc.command.list.queryOptions({}));
  const queryClient = useQueryClient();
  const addCommand = useMutation(
    orpc.command.addCommand.mutationOptions({
      onMutate: (newCommand) => {
        queryClient.setQueryData(orpc.command.list.queryKey(), (old: unknown) => {
          const previousCommands = Array.isArray(old) ? old : [];

          return [
            ...previousCommands,
            {
              id: Math.random().toString(),
              ...newCommand,
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
 
  const deleteCommand = useMutation(
    orpc.command.deleteCommand.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }),
  );
  const updateCommand = useMutation(
    orpc.command.updateCommand.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }),
  );
  return {
    commands,
    name,
    setName,
    quantity,
    setQuantity,
    remark,
    setRemark,
    payment,
    setPayment,
    addCommand() {
      addCommand.mutate({ name, quantity, remark, payment });
      setName("");
      setQuantity(1);
      setRemark("");
      setPayment(false);
    },
    deleteCommand(id: string) {
      deleteCommand.mutate({ id });
    },
    updateCommand(id: string, data: { name: string; quantity: number; remark: string; payment: boolean }) {
      updateCommand.mutate({ id, data });
    },
  };
}