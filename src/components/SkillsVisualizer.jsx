"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const SKILL_COLORS = {
  beginner: "bg-blue-100 text-blue-800",
  intermediate: "bg-blue-300 text-blue-900",
  expert: "bg-blue-600 text-white",
};

const SKILL_DATA = [
  {
    category: "Frontend",
    name: "React",
    level: "beginner",
    experience: "3 months experience",
  },
  {
    category: "Frontend",
    name: "Next.js",
    level: "beginner",
    experience: "1 month experience",
  },
  {
    category: "Frontend",
    name: "TypeScript",
    level: "beginner",
    experience: "1+ year experience",
  },
  {
    category: "Backend",
    name: "Node.js",
    level: "beginner",
    experience: "1+ year experience",
  },
  {
    category: "Backend",
    name: "MySQL",
    level: "beginner",
    experience: "1+ year experience",
  },
  {
    category: "Frontend",
    name: "HTML",
    level: "intermediate",
    experience: "1+ year experience",
  },
  {
    category: "Frontend",
    name: "CSS/SASS",
    level: "intermediate",
    experience: "1+ year experience",
  },
  {
    category: "DevOps",
    name: "CI/CD (GitHub Actions)",
    level: "intermediate",
    experience: "1+ year experience",
  },
  {
    category: "UI/UX",
    name: "Tailwind CSS",
    level: "beginner",
    experience: "3+ months experience",
  },
];

export default function SkillsVisualizer() {
  const [category, setCategory] = useState("All");
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(SKILL_DATA.map((s) => s.category)))],
    []
  );
  const filtered = SKILL_DATA.filter(
    (skill) => category === "All" || skill.category === category
  );

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm text-stone-500">Tech stack</p>
        <h2 className="text-3xl font-bold text-stone-900 dark:text-stone-100">
          Skills visualizer
        </h2>
        <p className="text-sm text-stone-600 dark:text-stone-300">
          Filter by category and view experience level at a glance.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant={category === cat ? "default" : "outline"}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((skill) => (
          <Card key={skill.name} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                {skill.name}
              </h3>
              <Badge className={SKILL_COLORS[skill.level]}>{skill.level}</Badge>
            </div>
            <p className="text-sm text-stone-500">{skill.category}</p>
            <p className="text-sm text-stone-700 dark:text-stone-200">
              {skill.experience}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
