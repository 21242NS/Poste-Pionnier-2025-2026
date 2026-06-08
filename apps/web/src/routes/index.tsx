import { createFileRoute } from "@tanstack/react-router";

import { orpc } from "@/utils/orpc";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Poste Pionnier 124" },
      {
        name: "description",
        content:
          "Site officiel du Poste Pionnier de la 124ème unité de Watermael-Boitsfort.",
      },
    ],
  }),
  component: HomeComponent,
});

const TITLE_TEXT = `
 ██████╗ ███████╗████████╗████████╗███████╗██████╗
 ██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██╔════╝██╔══██╗
 ██████╔╝█████╗     ██║      ██║   █████╗  ██████╔╝
 ██╔══██╗██╔══╝     ██║      ██║   ██╔══╝  ██╔══██╗
 ██████╔╝███████╗   ██║      ██║   ███████╗██║  ██║
 ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ╚══════╝╚═╝  ╚═╝

 ████████╗    ███████╗████████╗ █████╗  ██████╗██╗  ██╗
 ╚══██╔══╝    ██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝
    ██║       ███████╗   ██║   ███████║██║     █████╔╝
    ██║       ╚════██║   ██║   ██╔══██║██║     ██╔═██╗
    ██║       ███████║   ██║   ██║  ██║╚██████╗██║  ██╗
    ╚═╝       ╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝
 `;




function HomeComponent() {
  return (
    <main>
        <h1>Poste Pionnier 124</h1>
        <div>
          <h2>A propos de nous</h2>
          <p> Nous somme le poste pionnier de la 124 ème unité de watermeal-boitsfort. Bienvenue sur notre site internet ou vous pouvez ...</p>
      </div>
    </main>
  );
}
