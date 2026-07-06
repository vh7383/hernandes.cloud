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
        <h3 className="text-lg font-semibold">{project.title}</h3>
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
      </div>
    </article>
  );
}
