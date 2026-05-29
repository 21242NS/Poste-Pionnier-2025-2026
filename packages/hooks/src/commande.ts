import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { orpc } from "../../../apps/web/src/utils/orpc";
import { useState } from "react";

type ORPC = typeof orpc;

type Role = "PARENT_ANIMEE" | "ANIMEE" | "ANIMATEUR" | "ADMIN" | "EXTERN";
type Section = "BALADIN" | "MEUTE_SEEONEE" | "MEUTE_DU_PEUPLE_LIBRE" | "TROUPE_DU_GRAND_VENEUR_GOELAND";
type SandwichChoice = "POULET_CURRY" | "HOUMOUS" | "CLUB_JAMBON_FROMAGE" | "JAMBON" | "FROMAGE" | "THON";
type Sauce = "MAYONNAISE" | "KETCHUP" | "NONE";
type Juice = "ORANGE" | "POMME";


export type CommandInput = {
  role: Role;
  email: string;
  section: Section;
  name: string;
  sandwichChoice: SandwichChoice;
  tomato?: boolean;
  lettuce?: boolean;
  cucumber?: boolean;
  sauce: Sauce;
  juice: Juice;
  remark?: string;
  payment?: boolean;
};

export function useCommand(orpc: ORPC) {
  const [role, setRole] = useState<Role>("EXTERN");
  const [email, setEmail] = useState("");
  const [section, setSection] = useState<Section>("BALADIN");
  const [name, setName] = useState("");
  const [sandwichChoice, setSandwichChoice] = useState<SandwichChoice>("JAMBON");
  const [tomato, setTomato] = useState(false);
  const [lettuce, setLettuce] = useState(false);
  const [cucumber, setCucumber] = useState(false);
  const [sauce, setSauce] = useState<Sauce>("NONE");
  const [juice, setJuice] = useState<Juice>("ORANGE");
  const [remark, setRemark] = useState("");
  const [payment, setPayment] = useState(false);

  const commands = useQuery(orpc.command.list.queryOptions({}));
  const queryClient = useQueryClient();

  const addCommandMutation = useMutation(
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

  const deleteCommandMutation = useMutation(
    orpc.command.deleteCommand.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }),
  );

  const updateCommandMutation = useMutation(
    orpc.command.updateCommand.mutationOptions({
      onSettled: () => {
        queryClient.invalidateQueries();
      },
    }),
  );

  function resetForm() {
    setRole("EXTERN");
    setEmail("");
    setSection("BALADIN");
    setName("");
    setSandwichChoice("JAMBON");
    setTomato(false);
    setLettuce(false);
    setCucumber(false);
    setSauce("NONE");
    setJuice("ORANGE");
    setRemark("");
    setPayment(false);
  }

  return {
    commands,
    role, setRole,
    email, setEmail,
    section, setSection,
    name, setName,
    sandwichChoice, setSandwichChoice,
    tomato, setTomato,
    lettuce, setLettuce,
    cucumber, setCucumber,
    sauce, setSauce,
    juice, setJuice,
    remark, setRemark,
    payment, setPayment,
    addCommand() {
      addCommandMutation.mutate({ role, email, section, name, sandwichChoice, tomato, lettuce, cucumber, sauce, juice, remark, payment });
      resetForm();
    },
    deleteCommand(id: string) {
      deleteCommandMutation.mutate({ id });
    },
    updateCommand(id: string, data: CommandInput) {
      updateCommandMutation.mutate({ id, data });
    },
    isAdding: addCommandMutation.isPending,
    isDeleting: deleteCommandMutation.isPending,
    isUpdating: updateCommandMutation.isPending,
  };
}