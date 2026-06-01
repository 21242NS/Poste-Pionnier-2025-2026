import { Spinner } from "heroui-native";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";

import { Container } from "@/components/container";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/orpc";

export default function Accueil() {
  const { data: session, isPending } = authClient.useSession();
  const [authMode, setAuthMode] = useState<"signin" | "signup" | null>(null);

  if (isPending) {
    return (
      <Container className="p-6">
        <View className="flex-1 items-center justify-center">
          <Spinner />
        </View>
      </Container>
    );
  }

  return (
    <Container className="p-6">
      <Text className="text-3xl font-bold text-foreground mb-8">Poste Pionnier 124</Text>

      {session?.user ? (
        <View className="bg-surface border border-divider rounded-2xl p-5 mb-4">
          <Text className="text-foreground text-base font-medium mb-1">
            Bienvenue, {session.user.name} !
          </Text>
          <Text className="text-muted text-sm mb-1">{session.user.email}</Text>
          <Text className="text-muted text-xs mb-4">
            Poste Pionnier 124 · Watermael-Boitsfort
          </Text>
          <Pressable
            className="mt-4 bg-danger py-2.5 px-4 rounded-xl items-center active:opacity-70"
            onPress={() => {
              authClient.signOut();
              queryClient.invalidateQueries();
            }}
          >
            <Text className="text-danger-foreground font-medium">Se déconnecter</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View className="flex-row gap-3 mb-6">
            <Pressable
              className={`flex-1 py-3 rounded-xl border items-center active:opacity-80 ${
                authMode === "signin"
                  ? "bg-accent border-accent"
                  : "border-divider bg-surface"
              }`}
              onPress={() => setAuthMode(authMode === "signin" ? null : "signin")}
            >
              <Text
                className={`font-medium ${
                  authMode === "signin" ? "text-accent-foreground" : "text-foreground"
                }`}
              >
                Se connecter
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-3 rounded-xl border items-center active:opacity-80 ${
                authMode === "signup"
                  ? "bg-accent border-accent"
                  : "border-divider bg-surface"
              }`}
              onPress={() => setAuthMode(authMode === "signup" ? null : "signup")}
            >
              <Text
                className={`font-medium ${
                  authMode === "signup" ? "text-accent-foreground" : "text-foreground"
                }`}
              >
                S'inscrire
              </Text>
            </Pressable>
          </View>

          {authMode === "signin" && <SignIn />}
          {authMode === "signup" && <SignUp />}
        </>
      )}
    </Container>
  );
}

