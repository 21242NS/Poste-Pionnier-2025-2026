import { createFileRoute, redirect } from "@tanstack/react-router";

import { getUser } from "@/functions/get-user";
import { orpc } from "@/utils/orpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select } from "@/components/ui/select";
import { useCommand } from "hooks";
import type { CommandeRecord } from "hooks";
import {
  Card,
  CardContent,
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

const SANDWICH_LABELS: Record<string, string> = {
  POULET_CURRY: "Poulet curry",
  HOUMOUS: "Houmous",
  CLUB_JAMBON_FROMAGE: "Club jambon fromage",
  JAMBON: "Jambon",
  FROMAGE: "Fromage",
  THON: "Thon",
};

const SAUCE_LABELS: Record<string, string> = {
  MAYONNAISE: "Mayonnaise",
  KETCHUP: "Ketchup",
  NONE: "Aucune",
};

const JUICE_LABELS: Record<string, string> = {
  ORANGE: "Orange",
  POMME: "Pomme",
};

const SECTION_LABELS: Record<string, string> = {
  BALADIN: "Baladin",
  MEUTE_SEEONEE: "Meute Seeonee",
  MEUTE_DU_PEUPLE_LIBRE: "Meute du Peuple Libre",
  TROUPE_DU_GRAND_VENEUR_GOELAND: "Troupe du Grand Veneur Goéland",
};

const ROLE_LABELS: Record<string, string> = {
  PARENT_ANIMEE: "Parent animé",
  ANIMEE: "Animé",
  ANIMATEUR: "Animateur",
  ADMIN: "Admin",
  EXTERN: "Externe",
};

function RouteComponent() {
  const {
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
    addCommand,
    deleteCommand,
    isAdding,
  } = useCommand(orpc);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pic-Nic</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Nouvelle commande</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Nom</Label>
              <Input
                placeholder="Nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Rôle</Label>
              <Select value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Section</Label>
              <Select value={section} onChange={(e) => setSection(e.target.value as typeof section)}>
                {Object.entries(SECTION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Sandwich</Label>
            <Select value={sandwichChoice} onChange={(e) => setSandwichChoice(e.target.value as typeof sandwichChoice)}>
              {Object.entries(SANDWICH_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Garnitures</Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={tomato} onCheckedChange={(v) => setTomato(Boolean(v))} />
                <span>Tomate</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={lettuce} onCheckedChange={(v) => setLettuce(Boolean(v))} />
                <span>Salade</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox checked={cucumber} onCheckedChange={(v) => setCucumber(Boolean(v))} />
                <span>Concombre</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Sauce</Label>
              <Select value={sauce} onChange={(e) => setSauce(e.target.value as typeof sauce)}>
                {Object.entries(SAUCE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Jus</Label>
              <Select value={juice} onChange={(e) => setJuice(e.target.value as typeof juice)}>
                {Object.entries(JUICE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1">
            <Label>Remarque</Label>
            <Input
              placeholder="Remarque (optionnel)"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox checked={payment} onCheckedChange={(v) => setPayment(Boolean(v))} />
            <span>Payé</span>
          </label>
        </CardContent>
        <CardFooter>
          <Button onClick={addCommand} disabled={isAdding || !name || !email}>
            {isAdding ? "Ajout..." : "Ajouter la commande"}
          </Button>
        </CardFooter>
      </Card>

      <h2 className="text-xl font-semibold mb-4">Commandes</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted text-muted-foreground text-left">
              <th className="px-3 py-2 font-medium whitespace-nowrap">Nom</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">Email</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">Section</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">Rôle</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">Sandwich</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">Garnitures</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">Sauce</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">Jus</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">Remarque</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap">Payé</th>
              <th className="px-3 py-2 font-medium whitespace-nowrap"></th>
            </tr>
          </thead>
          <tbody>
            {(commands.data ?? [] as CommandeRecord[]).map((command: CommandeRecord, i: number) => (
              <tr
                key={command.id}
                className={i % 2 === 0 ? "bg-background" : "bg-muted/30"}
              >
                <td className="px-3 py-2 whitespace-nowrap font-medium">{command.name}</td>
                <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">{command.email}</td>
                <td className="px-3 py-2 whitespace-nowrap">{SECTION_LABELS[command.section] ?? command.section}</td>
                <td className="px-3 py-2 whitespace-nowrap">{ROLE_LABELS[command.role] ?? command.role}</td>
                <td className="px-3 py-2 whitespace-nowrap">{SANDWICH_LABELS[command.sandwichChoice] ?? command.sandwichChoice}</td>
                <td className="px-3 py-2 whitespace-nowrap">
                  {[command.tomato && "Tomate", command.lettuce && "Salade", command.cucumber && "Concombre"].filter(Boolean).join(", ") || <span className="text-muted-foreground">—</span>}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">{SAUCE_LABELS[command.sauce] ?? command.sauce}</td>
                <td className="px-3 py-2 whitespace-nowrap">{JUICE_LABELS[command.juice] ?? command.juice}</td>
                <td className="px-3 py-2 max-w-50 truncate text-muted-foreground">{command.remark ?? <span>—</span>}</td>
                <td className="px-3 py-2 whitespace-nowrap text-center">
                  {command.payment ? (
                    <span className="text-green-600 font-medium">Oui</span>
                  ) : (
                    <span className="text-muted-foreground">Non</span>
                  )}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <Button variant="outline" size="sm" onClick={() => deleteCommand(command.id)}>
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
            {(commands.data?.length ?? 0) === 0 && (
              <tr>
                <td colSpan={11} className="px-3 py-6 text-center text-muted-foreground">
                  Aucune commande
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
