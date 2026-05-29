
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";

import { orpc } from "@/utils/orpc";
import { getUser } from "@/functions/get-user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTicket } from "hooks";


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
  const { tickets, addTicket, updateTicket, deleteTicket, description, setDescription } = useTicket(orpc);
  const [editingTicketId, setEditingTicketId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");

  function startEditing(id: string, currentDescription: string) {
    setEditingTicketId(id);
    setEditingDescription(currentDescription);
  }

  function confirmUpdate() {
    if (!editingTicketId || !editingDescription.trim()) {
      return;
    }

    updateTicket(editingTicketId, editingDescription);
    setEditingTicketId(null);
    setEditingDescription("");
  }

  function cancelUpdate() {
    setEditingTicketId(null);
    setEditingDescription("");
  }

  const textareaClassName =
    "min-h-24 w-full rounded-none border border-input bg-transparent px-3 py-2 text-xs leading-relaxed outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <Card className="border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="text-xl uppercase tracking-[0.18em]">Tickets</CardTitle>
          <CardDescription>
            Suivi des demandes et modification rapide de leur description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <label className="block text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              Nouveau ticket
            </label>
            <textarea
              className={textareaClassName}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décris précisément le problème ou la demande."
            />
          </div>
        </CardContent>
        <CardFooter className="justify-between gap-3">
          <p className="text-muted-foreground text-[11px] uppercase tracking-[0.14em]">
            {tickets.data?.length ?? 0} ticket(s)
          </p>
          <Button onClick={addTicket} disabled={!description.trim()}>
            Add Ticket
          </Button>
        </CardFooter>
      </Card>

      {tickets.isLoading ? (
        <Card size="sm">
          <CardContent className="py-8 text-center text-muted-foreground">Loading...</CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tickets.data?.map((ticket, index) => (
            <Card key={ticket.id} size="sm" className="border-l-2 border-l-border">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-4">
                  <span className="uppercase tracking-[0.16em] text-muted-foreground">
                    Ticket {String(index + 1).padStart(2, "0")}
                  </span>
                </CardTitle>
                <CardDescription>
                  {editingTicketId === ticket.id
                    ? "Modifie le texte puis confirme le changement."
                    : "Description actuelle du ticket."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {editingTicketId === ticket.id ? (
                  <textarea
                    className={textareaClassName}
                    value={editingDescription}
                    onChange={(e) => setEditingDescription(e.target.value)}
                  />
                ) : (
                  <p className="whitespace-pre-wrap text-sm leading-6">{ticket.description}</p>
                )}
              </CardContent>
              <CardFooter className="justify-end gap-2">
                {editingTicketId === ticket.id ? (
                  <>
                    <Button variant="outline" onClick={cancelUpdate}>
                      Cancel
                    </Button>
                    <Button onClick={confirmUpdate} disabled={!editingDescription.trim()}>
                      Confirm
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => startEditing(ticket.id, ticket.description)}
                    >
                      Update
                    </Button>
                    <Button variant="destructive" onClick={() => deleteTicket(ticket.id)}>
                      Delete
                    </Button>
                  </>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </main>
  );
}
