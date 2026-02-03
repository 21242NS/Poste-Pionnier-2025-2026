import type { AppRouterClient } from "@Poste-Pionnier-2025-2026/api/routers/index";

import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { env } from "@Poste-Pionnier-2025-2026/env/native";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { Platform } from "react-native";

import { authClient } from "@/lib/auth-client";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      console.log(error);
    },
  }),
});

export const link = new RPCLink({
  url: `${env.EXPO_PUBLIC_SERVER_URL}/api/rpc`,
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
