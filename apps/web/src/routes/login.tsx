import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";

export const Route = createFileRoute("/login")({
  validateSearch: z.object({
    mode: z.enum(["signin", "signup"]).optional().default("signin"),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { mode } = Route.useSearch();
  const navigate = Route.useNavigate();

  return mode === "signup" ? (
    <SignUpForm onSwitchToSignIn={() => navigate({ search: { mode: "signin" } })} />
  ) : (
    <SignInForm onSwitchToSignUp={() => navigate({ search: { mode: "signup" } })} />
  );
}
