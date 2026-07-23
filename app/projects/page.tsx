import type { Metadata } from "next";
import { projects } from "@/content/projects";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = {
  title: "Projets - hernandes.cloud",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Projets</h1>
      <p className="mt-3 text-foreground/70">
        Liste non exhaustive, mise à jour au fil de l&apos;eau - voir{" "}
        <code className="rounded bg-surface px-1.5 py-0.5 text-sm">
          content/projects.ts
        </code>
        .
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
