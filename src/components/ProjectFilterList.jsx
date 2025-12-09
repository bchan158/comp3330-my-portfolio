"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createSlug } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import EditProjectButton from "@/components/EditProjectButton";
import DeleteProjectButton from "@/components/DeleteProjectButton";

export default function ProjectFilterList({ projects = [], user }) {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState([]);

  const tags = useMemo(() => {
    const set = new Set();
    projects.forEach((project) => {
      (project.keywords || []).forEach((tag) => set.add(tag));
    });
    return Array.from(set);
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter((project) => {
      const matchesQuery =
        !q ||
        project.title.toLowerCase().includes(q) ||
        project.description.toLowerCase().includes(q);
      const matchesTags =
        activeTags.length === 0 ||
        activeTags.every((tag) => project.keywords?.includes(tag));
      return matchesQuery && matchesTags;
    });
  }, [projects, query, activeTags]);

  const toggleTag = (tag) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <input
          className="w-full rounded border px-3 py-2 bg-white dark:bg-stone-900 dark:border-stone-700"
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`cursor-pointer ${
                  activeTags.includes(tag) ? "bg-blue-600 text-white" : ""
                }`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-stone-600 dark:text-stone-300">
          No projects match your filters.
        </p>
      )}

      {filtered.map((project, index) => {
        const slug = createSlug(project.title);
        return (
          <Card
            key={index}
            className="flex flex-col sm:flex-row w-full m-2 sm:m-0 p-3 sm:p-4 gap-3 bg-stone-700"
          >
            {project.img ? (
              <Image
                width={220}
                height={220}
                src={project.img}
                alt={project.title}
                className="h-[180px] w-full sm:h-[220px] sm:w-[220px] object-contain"
              />
            ) : (
              <div className="h-[180px] w-full sm:h-[220px] sm:w-[220px] bg-stone-600 rounded flex items-center justify-center">
                <span className="text-stone-400 text-sm">No Image</span>
              </div>
            )}
            <div className="flex flex-col flex-1 gap-2">
              <h3 className="text-lg font-bold text-stone-50">
                {project.title}
              </h3>
              <p className="text-sm text-stone-200 line-clamp-3">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.keywords?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/projects/${slug}`} target="_blank" rel="noopen">
                    View Project
                  </Link>
                </Button>
                {user && (
                  <div className="flex flex-wrap gap-2">
                    <EditProjectButton projectId={project.id} slug={slug} />
                    <DeleteProjectButton projectId={project.id} />
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
