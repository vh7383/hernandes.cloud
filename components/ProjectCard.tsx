import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/content/projects";

const statusLabel: Record<Project["status"], string> = {
  active: "En cours",
  archived: "Archivé",
  idea: "Idée",
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          {project.logo && (
            <Image
              src={project.logo}
              alt={`Logo ${project.title}`}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded object-contain"
            />
          )}
          <h3 className="text-lg font-semibold">{project.title}</h3>
        </div>
        <span className="shrink-0 rounded-full border border-border px-2 py-0.5 text-xs text-foreground/60">
          {statusLabel[project.status]}
        </span>
      </div>
      <p className="text-sm text-foreground/70">{project.description}</p>
      <ul className="flex flex-wrap gap-2 text-xs text-foreground/60">
        {project.stack.map((tech) => (
          <li key={tech} className="rounded border border-border px-2 py-0.5">
            {tech}
          </li>
        ))}
      </ul>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
        {project.links?.repo && (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand hover:underline"
          >
            Voir le code ↗
          </a>
        )}
        {project.links?.board && (
          <a
            href={project.links.board}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand hover:underline"
          >
            Suivi du projet ↗
          </a>
        )}
        {project.links?.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-brand hover:underline"
          >
            Voir le site ↗
          </a>
        )}
        {project.links?.page && (
          <Link href={project.links.page} className="text-sm font-medium text-brand hover:underline">
            En savoir plus
          </Link>
        )}
      </div>
    </article>
  );
}
