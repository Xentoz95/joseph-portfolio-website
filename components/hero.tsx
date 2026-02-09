'use client';

import Image from 'next/image';
import LetterGlitch from './letter-glitch';
import { BlurText } from './blur-text';
import { Github, Linkedin, Mail } from 'lucide-react';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-20 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Letter/Number Glitch Effect Background Only */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none bg-gradient-to-br from-background via-background to-primary/5">
        <LetterGlitch
          glitchColors={['#ff7f3f', '#1f2937', '#374151']}
          glitchSpeed={40}
          centerVignette={false}
          outerVignette={true}
          smooth={true}
          characters="01"
        />
      </div>

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="space-y-4">
              <BlurText
                text="Welcome to my portfolio"
                className="text-primary font-semibold text-lg tracking-wide"
                delay={100}
                animateBy="words"
                direction="top"
              />
              <BlurText
                text="I'm Joseph Thuo"
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-tight text-balance"
                delay={150}
                animateBy="words"
                direction="top"
              />
              <BlurText
                text="Creative Web Developer & System Builder"
                className="text-3xl sm:text-4xl font-bold text-primary/80 leading-tight text-balance"
                delay={200}
                animateBy="words"
                direction="top"
              />
            </div>

            <BlurText
              text="I craft modern web experiences, powerful systems, and digital solutions that solve real problems. From responsive frontends to custom dashboards, I turn ideas into impactful products."
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-md block"
              delay={300}
              animateBy="words"
              direction="bottom"
            />

            <BlurText
              text="Specializing in web development, UI/UX design, systems architecture, and business tools."
              className="text-base text-muted-foreground leading-relaxed max-w-md block"
              delay={500}
              animateBy="words"
              direction="bottom"
            />

            {/* Social Links */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="https://github.com/josephthuo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/josephthuo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Linkedin className="w-5 h-5" />
                LinkedIn
              </a>
              <a
                href="mailto:thuojesseph405@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 bg-foreground text-background font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                Email
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1"
              >
                Get in Touch
              </a>
              <a
                href="#projects"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary/10 transition-all duration-300"
              >
                View My Work
              </a>
            </div>
          </div>

          {/* Enlarged Profile Image - NO Antigravity Effect */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative w-[400px] h-[500px] sm:w-[450px] sm:h-[550px] lg:w-[500px] lg:h-[600px] rounded-3xl overflow-hidden border-4 border-primary/30 shadow-2xl hover:shadow-primary/40 transition-all duration-300 group bg-background">
              <Image
                src="/images/profile/WhatsApp Image 2025-12-08 at 10.05.16 AM.jpeg"
                alt="Joseph Thuo - Full Stack Developer"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 640px) 400px, (max-width: 1024px) 450px, 500px"
              />

              {/* Gradient overlay for depth on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground px-8 py-4 rounded-2xl shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="text-center">
                <div className="text-3xl font-bold">5+</div>
                <div className="text-sm">Years Exp.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
