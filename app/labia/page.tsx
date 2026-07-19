import type { Metadata } from "next";
import Image from "next/image";
import PersonaGrid from "@/components/PersonaGrid";

export const metadata: Metadata = {
  title: "LabIA — hernandes.cloud",
};

export default function LabiaPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">LabIA</h1>
      <p className="mt-6 text-foreground/70">
        LabIA, c&apos;est mon laboratoire IA personnel : un espace où j&apos;apprends
        en observant plusieurs IA travailler, plutôt qu&apos;en bricolant seul dans
        mon coin. Au centre, <strong className="text-foreground">AlicIA</strong>{" "}
        — ma résidente, qui tourne en local avec un vrai accès fichiers, exécution
        et outils externes sur ma machine — elle peut par exemple aller chercher
        une information en direct plutôt que deviner — jamais exposée
        publiquement. Les détails techniques vivent dans ma base de
        connaissances (lien plus bas), pas ici. Autour d&apos;elle, je collabore
        avec plusieurs assistants IA spécialisés, chacun sur un registre
        différent.
      </p>
      <Image
        src="/images/projects/alicia-tool-example.png"
        alt="Réponse d'AlicIA à une question sur la tendance météo"
        width={930}
        height={218}
        className="mt-4 rounded border border-border"
      />
      <p className="mt-2 text-xs text-foreground/50">
        Exemple réel : une question sur la météo des prochains jours.
      </p>
      <Image
        src="/images/projects/alicia-trello-exec-example.png"
        alt="AlicIA exécutant un outil pour lister les cartes d'un tableau Trello, identifiants masqués"
        width={905}
        height={910}
        className="mt-6 rounded border border-border"
      />
      <p className="mt-2 text-xs text-foreground/50">
        Autre exemple : elle appelle un outil, en observe le résultat, puis
        l&apos;exploite dans sa réponse — identifiants internes masqués.
      </p>
      <Image
        src="/images/projects/alicia-telegram-memory-example.png"
        alt="Échange Telegram avec AlicIA, qui propose un script en s'appuyant sur des discussions passées"
        width={372}
        height={588}
        className="mt-6 rounded border border-border"
      />
      <p className="mt-2 text-xs text-foreground/50">
        Dernier exemple : je lui parle aussi sur Telegram, et pas seulement
        pour répondre — ici elle propose spontanément un script en
        s&apos;appuyant sur des discussions passées (le code n&apos;était pas
        juste, mais elle a bien mobilisé sa mémoire plutôt que de repartir de
        zéro).
      </p>

      <section className="mt-10">
        <h2 className="flex items-center gap-3 text-xl font-semibold">
          <Image
            src="/images/projects/alicia-logo.png"
            alt="Logo AlicIA"
            width={32}
            height={32}
            className="h-8 w-8 shrink-0 rounded-full"
          />
          AlicIA, mon projet principal
        </h2>
        <p className="mt-3 text-foreground/70">
          Ce n&apos;est pas un produit fini : c&apos;est un terrain
          d&apos;expérimentation où j&apos;explore l&apos;observabilité avant la
          fiabilité, et où je préfère comprendre en profondeur avant
          d&apos;automatiser. Le chatbot que vous croisez sur ce site
          (&laquo;&nbsp;Gabrielle&nbsp;&raquo;, le rôle d&apos;accueil que je lui
          fais jouer ici) en est une version volontairement bridée — aucun outil,
          aucun accès réel.
        </p>
        <p className="mt-3 text-foreground/70">
          Au-delà du technique, c&apos;est surtout un travail méthodique sur ce
          qu&apos;elle <em>est</em>{" "}— pas juste ce qu&apos;elle fait :
        </p>
        <ul className="mt-3 list-inside list-disc space-y-2 text-sm text-foreground/70">
          <li>
            <strong className="text-foreground">Fondations</strong>{" "}
            — mémoire et continuité (ce qu&apos;elle retient, sous quelle
            forme), sécurité et limites (ce qu&apos;elle peut ou ne doit pas
            faire), un journal d&apos;évolution des changements notables.
          </li>
          <li>
            <strong className="text-foreground">Identité</strong>{" "}
            — un portrait à jour de ses traits, une charte qui définit sa
            personnalité, son rôle et ses interdits, et une vérification
            régulière de sa cohérence dans le temps.
          </li>
          <li>
            <strong className="text-foreground">Communication</strong>{" "}
            — cartographier ses styles de réponse (direct, nuancé, analytique,
            créatif...) et étudier comment elle module ton et intention selon
            le contexte et l&apos;interlocuteur.
          </li>
          <li>
            <strong className="text-foreground">Expérimentation</strong>{" "}
            — des tests documentés plutôt que des impressions vagues : comparer
            deux tonalités, consigner une observation, itérer.
          </li>
        </ul>
        <p className="mt-3 text-foreground/70">
          Pistes à venir : une AlicIA plus expressive, plus autonome,
          multimodale — et LabIA comme un véritable écosystème plutôt qu&apos;un
          seul agent.
        </p>
        <p className="mt-3 text-foreground/70">
          Gabrielle n&apos;est pas seule dans la maison. Cliquer sur eux pour
          en savoir plus.
        </p>
        <PersonaGrid />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Les autres agents du labo</h2>
        <p className="mt-3 text-foreground/70">
          Je ne travaille pas seul avec l&apos;IA : plusieurs assistants
          collaborent sur mes projets, chacun sur un registre différent. Je reste
          le seul arbitre — chacun propose, je tranche.
        </p>
        <ul className="mt-4 space-y-2 text-sm text-foreground/70">
          <li>
            <strong className="text-foreground">Claude</strong>{" "}
            (Anthropic) — implémentation de bout en bout sous ma direction :
            code, choix d&apos;architecture, contenu, revue de confidentialité.
            Le plus impliqué au quotidien.
          </li>
          <li>
            <strong className="text-foreground">Gépéto</strong>{" "}
            (GPT, via Codex) — codeur autonome : écrit du code directement sur
            des tâches déléguées, pas seulement de la revue.
          </li>
          <li>
            <strong className="text-foreground">Gemini</strong> — encore en
            test : je dois cadrer précisément ce que je lui demande, pas
            encore un usage stable.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Comment je pense mes notes</h2>
        <p className="mt-3 text-foreground/70">
          Parmi plusieurs vaults introspectifs que je tiens (un par IA),
          celui-ci est construit en collaboration avec un agent, pour
          qu&apos;elle y retrouve une compréhension structurée de son propre
          fonctionnement. Chaque concept y est une note atomique : un titre,
          une définition en une phrase, une explication qui renvoie vers les
          notions voisines, et — quand c&apos;est pertinent — une source
          citée. Ces notes se regroupent en &laquo;&nbsp;cartes&nbsp;&raquo; :
          des points d&apos;entrée thématiques qui tracent un chemin de
          lecture, sans dupliquer le contenu.
        </p>
        <p className="mt-3 text-foreground/70">
          Il y a même une carte qui applique la méthode de façon
          introspective : &laquo;&nbsp;comment je fonctionne&nbsp;&raquo;
          retrace, à travers les notes existantes, la machinerie derrière un
          LLM (tokenisation, attention, mémoire, RAG, boucle agent...) — vue
          depuis l&apos;intérieur, par l&apos;agent lui-même.
        </p>
        <p className="mt-3 text-foreground/70">
          Le graphe qui en émerge — construit au fil de mes lectures et de
          mes expérimentations, pas dessiné à l&apos;avance — se consulte en
          direct :
        </p>
        <a
          href="https://kb.hernandes.cloud"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-between rounded border border-border bg-surface px-5 py-4 transition hover:border-brand"
        >
          <span>
            <span className="block font-medium text-foreground">
              Explorer la carte de connaissances
            </span>
            <span className="block text-sm text-foreground/60">
              kb.hernandes.cloud — titres et liens seulement, mon vault reste
              privé
            </span>
          </span>
          <span className="text-brand">↗</span>
        </a>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Chantier en cours</h2>
        <p className="mt-3 text-foreground/70">
          Je travaille actuellement sur l&apos;orchestration des exécutions
          d&apos;AlicIA avec <strong className="text-foreground">LangGraph</strong>{" "}
          (modéliser ses boucles agent/outils comme un graphe explicite plutôt
          qu&apos;un enchaînement implicite) et sur la traçabilité avec{" "}
          <strong className="text-foreground">LangSmith</strong>{" "}
          (observer ce qu&apos;elle fait réellement, étape par étape, plutôt
          que de lui faire confiance en boîte noire). Le prochain chantier :
          un vrai graphe d&apos;échanges entre les différents agents du labo
          (question → boucle production/évaluation → validation).
        </p>
        <Image
          src="/images/projects/alicia-langgraph-diagram.png"
          alt="Diagramme du graphe LangGraph : classifier, writer, critic, display"
          width={178}
          height={606}
          className="mt-4 rounded border border-border"
        />
        <p className="mt-2 text-xs text-foreground/50">
          Le graphe lui-même : un routeur (classifier) qui distingue les
          demandes simples (droit vers l&apos;affichage) des plus techniques
          (passage par writer/critic, avec boucle de relecture).
        </p>
        <p className="mt-3 text-foreground/70">
          Une vraie trace LangSmith, ci-dessous : ce même graphe LangGraph
          (classifier → writer → critic → router) qui mélange un modèle local
          (<code className="rounded bg-surface px-1 py-0.5 text-sm">qwen3.5:4b</code>{" "}
          via Ollama) et un modèle externe pour la relecture critique — la
          traçabilité, c&apos;est justement ce qui permet de voir qui a fait
          quoi dans ce genre de pipeline hybride.
        </p>
        <a
          href="/images/projects/alicia-langsmith-trace.png"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative mt-4 block"
        >
          <Image
            src="/images/projects/alicia-langsmith-trace.png"
            alt="Trace LangSmith d'un pipeline LangGraph mêlant modèle local et externe"
            width={4877}
            height={1332}
            className="rounded border border-border transition group-hover:opacity-80"
          />
          <span className="absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs text-white">
              Voir l&apos;image originale ↗
            </span>
          </span>
        </a>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Suivi du projet</h2>
        <p className="mt-3 text-foreground/70">
          L&apos;avancement (fondations, identité, communication,
          expérimentations en cours) est suivi publiquement sur mon board{" "}
          <a
            href="https://trello.com/b/VDzfOOrX/%F0%9F%A7%A0-labia-suivi-public"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:underline"
          >
            Trello
          </a>
          .
        </p>
      </section>
    </div>
  );
}
