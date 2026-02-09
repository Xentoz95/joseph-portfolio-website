import { Suspense } from 'react';
import { getFeaturedProjects } from '@/lib/supabase/projects';
import { ProjectGridWrapper } from './project/ProjectGridWrapper';
import { BlurText } from './blur-text';
import { about } from '@/data';

export async function Projects() {
  // Fetch featured projects from Supabase
  const projects = await getFeaturedProjects(6);

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-6xl mx-auto">
        <BlurText
          text="Featured Projects"
          className="text-4xl sm:text-5xl font-bold text-foreground mb-4 text-balance"
          delay={100}
          animateBy="words"
          direction="top"
        />
        <BlurText
          text="A selection of recent work showcasing web, system, and dashboard solutions"
          className="text-lg text-muted-foreground mb-12 block"
          delay={200}
          animateBy="words"
          direction="bottom"
        />

        <Suspense fallback={<div className="text-center py-8">Loading projects...</div>}>
          <ProjectGridWrapper initialProjects={projects} />
        </Suspense>

        {/* Stats Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-8 border border-primary/30">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-2xl font-bold text-primary mb-2">{about.stats.projects}+</h4>
              <p className="text-foreground/80">Web & System Projects</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-primary mb-2">{about.stats.clients}+</h4>
              <p className="text-foreground/80">Happy Clients & Teams</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold text-primary mb-2">{about.stats.years}+</h4>
              <p className="text-foreground/80">Years Experience</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
