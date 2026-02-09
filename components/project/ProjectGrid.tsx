'use client';

import { useState } from 'react';
import type { Project, ProjectCategory } from '@/types/database';
import { ProjectCard } from './ProjectCard';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const categories: { value: ProjectCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All Projects' },
  { value: 'web', label: 'Web' },
  { value: 'system', label: 'Systems' },
  { value: 'dashboard', label: 'Dashboards' },
  { value: 'design', label: 'Design' },
  { value: 'mobile', label: 'Mobile' },
];

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory | 'all'>('all');

  const filteredProjects =
    selectedCategory === 'all'
      ? projects
      : projects.filter((p) => p.category === selectedCategory);

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.value)}
            className="transition-all duration-200"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Projects Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">
                No projects found in this category.
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
