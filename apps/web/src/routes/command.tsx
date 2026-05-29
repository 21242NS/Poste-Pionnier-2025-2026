import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";

import { getUser } from "@/functions/get-user";
import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import {useCommand} from "hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export const Route = createFileRoute("/command")({
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
  const { session } = Route.useRouteContext();
  const { commands, addCommand, updateCommand, deleteCommand, name, setName, quantity, setQuantity, remark, setRemark, 
    payment, setPayment } = useCommand(orpc);

  const privateData = useQuery(orpc.privateData.queryOptions());

  return (
    <div>
      <h1>Pic-Nic</h1>
      <div>
        {commands.data?.map((command) => (
          <Card key={command.id} className="mb-4">
            <CardHeader>
              <CardTitle>{command.name}</CardTitle>
              <CardDescription>Quantité: {command.quantity}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{command.remark}</p>
              <p>Payé: {command.payment ? "Oui" : "Non"}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => deleteCommand.mutate({ id: command.id })}>
                Supprimer
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      
    </div>
  );
}
