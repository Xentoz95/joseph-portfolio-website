'use client';

import dynamic from 'next/dynamic';
import { BlurText } from './blur-text';

const LetterGlitch = dynamic(() => import('./letter-glitch').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="w-full h-64 bg-black rounded-2xl animate-pulse" />
});

export function GlitchSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Glitch Effect */}
          <div className="relative w-full h-64 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-2xl">
            <LetterGlitch
              glitchSpeed={80}
              glitchColors={['#ff7f3f', '#61dca3', '#61b3dc', '#2b4539']}
              centerVignette={false}
              outerVignette={true}
              smooth={true}
              characters="JOSEPHTHUO WEB DEVELOPER SYSTEM BUILDER"
            />
          </div>

          {/* Content */}
          <div className="space-y-6 text-white">
            <div className="space-y-4">
              <BlurText
                text="Advanced Solutions"
                className="text-primary font-semibold text-lg tracking-wide"
                delay={100}
                animateBy="words"
                direction="top"
              />
              <BlurText
                text="Building Digital Experiences That Stand Out"
                className="text-4xl sm:text-5xl font-bold text-foreground text-balance"
                delay={150}
                animateBy="words"
                direction="top"
              />
            </div>

            <BlurText
              text="I combine creative design with cutting-edge technology to build solutions that not only look stunning but deliver real value. Every project is an opportunity to push boundaries and create something extraordinary."
              className="text-lg text-foreground/80 leading-relaxed block"
              delay={300}
              animateBy="words"
              direction="bottom"
            />

            <ul className="space-y-3">
              {[
                'Interactive & Engaging User Interfaces',
                'Performance-Optimized Applications',
                'Custom System Architecture',
                'Scalable Digital Solutions'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-foreground/90">
                  <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="#projects"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1 mt-4"
            >
              Explore My Work
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
