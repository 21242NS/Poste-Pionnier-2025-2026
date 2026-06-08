import type { AppRouterClient } from "@Poste-Pionnier-2025-2026/api/routers/index";

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { env } from "@Poste-Pionnier-2025-2026/env/native";
import Constants from "expo-constants";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { Alert, Platform } from "react-native";

import { authClient } from "@/lib/auth-client";

function getServerUrl() {
  const configured = env.EXPO_PUBLIC_SERVER_URL;
  if (__DEV__ && Platform.OS !== "web" && configured.includes("localhost")) {
    const host = Constants.expoConfig?.hostUri?.split(":")[0];
    if (host && host !== "localhost") {
      const { port } = new URL(configured);
      return `http://${host}:${port}`;
    }
  }
  return configured;
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Une erreur est survenue.",
      );
    },
  }),
});

export const link = new RPCLink({
  url: `${getServerUrl()}/api/rpc`,
  fetch:
    Platform.OS !== "web"
      ? undefined
      : function (url, options) {
          return fetch(url, {
            ...options,
            credentials: "include",
          });
        },
  headers() {
    if (Platform.OS === "web") {
      return {};
    }
    const headers = new Map<string, string>();
    const cookies = authClient.getCookie();
    if (cookies) {
      headers.set("Cookie", cookies);
    }
    return Object.fromEntries(headers);
  },
});

export const client: AppRouterClient = createORPCClient(link);

export const orpc = createTanstackQueryUtils(client);
