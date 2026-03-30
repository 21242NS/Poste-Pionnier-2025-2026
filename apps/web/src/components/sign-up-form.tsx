import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import z from "zod";

import { orpc } from "@/utils/orpc";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select } from "./ui/select";

const AVAILABLE_ROLES = [
  { value: "parent", label: "Parent" },
  { value: "animee", label: "Animé(e)" },
  { value: "animateur", label: "Animateur/Animatrice" },
  { value: "extern", label: "Externe" },
] as const;

export default function SignUpForm({ onSwitchToSignIn }: { onSwitchToSignIn: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });

  const signUpMutation = useMutation(
    orpc.signUpWithRole.mutationOptions({
      onSuccess: () => {
        toast.success("Compte créé avec succès !");
        navigate({ to: "/login" });
      },
      onError: () => {
        toast.error("Erreur lors de la création du compte");
      },
    })
  );

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      name: "",
      role: "parent" as "parent" | "animee" | "animateur" | "extern",
    },
    onSubmit: async ({ value }) => {
      signUpMutation.mutate(value);
    },
    validators: {
      onSubmit: z.object({
        name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
        email: z.string().email("Adresse email invalide"),
        password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
        role: z.enum(["parent", "animee", "animateur", "extern"]),
      }),
    },
  });

  return (
    <div className="mx-auto w-full mt-10 max-w-md p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Créer un compte</h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <div>
          <form.Field name="name">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Nom</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm">
                    {(field.state.meta.errors[0] as any)?.message || String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm">
                    {(field.state.meta.errors[0] as any)?.message || String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Mot de passe</Label>
                <Input
                  id={field.name}
                  name={field.name}
                  type="password"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm">
                    {(field.state.meta.errors[0] as any)?.message || String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="role">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor={field.name}>Rôle</Label>
                <Select
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value as typeof field.state.value)}
                >
                  {AVAILABLE_ROLES.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </Select>
                {field.state.meta.errors.length > 0 && (
                  <p className="text-red-500 text-sm">
                    {(field.state.meta.errors[0] as any)?.message || String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </div>

        <form.Subscribe>
          {(state) => (
            <Button
              type="submit"
              className="w-full"
              disabled={!state.canSubmit || state.isSubmitting || signUpMutation.isPending}
            >
              {state.isSubmitting || signUpMutation.isPending ? "Création..." : "Créer mon compte"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-4 text-center">
        <Button
          variant="link"
          onClick={onSwitchToSignIn}
          className="text-indigo-600 hover:text-indigo-800"
        >
          Vous avez déjà un compte ? Se connecter
        </Button>
      </div>
    </div>
  );
}
