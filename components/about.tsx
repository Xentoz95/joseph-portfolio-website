'use client';

import Image from 'next/image';
import { Award } from 'lucide-react';
import { FadeIn } from './FadeIn';

export function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Brand Watermark Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/brand/4.png"
          alt=""
          fill
          className="object-cover opacity-[0.05] grayscale"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-6 mb-16">
          <FadeIn delay={100} className="text-primary font-semibold text-lg tracking-wide">
            Get to Know Me
          </FadeIn>
          <FadeIn delay={150} className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
            About Me & My Journey
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center mb-20">
          {/* Image - Left Side, Large */}
          <div className="flex items-center justify-center order-2 lg:order-1">
            <div className="relative w-full h-[450px] sm:h-[500px] lg:h-[550px] xl:h-[600px] rounded-3xl overflow-hidden border-4 border-primary/20 shadow-2xl hover:shadow-primary/40 transition-all duration-300 group">
              <Image
                src="/images/profile/WhatsApp Image 2025-12-08 at 10.05.02 AM.jpeg"
                alt="Joseph Thuo - Portrait"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 50vw"
                loading="lazy"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <FadeIn delay={250} className="text-lg sm:text-xl text-muted-foreground leading-relaxed block">
              I'm Joseph Thuo, a passionate Full Stack Developer with a hands-on approach to solving problems. My journey spans from learning the fundamentals of web development to building complex systems and digital solutions for real-world challenges.
            </FadeIn>
            <FadeIn delay={400} className="text-lg sm:text-xl text-muted-foreground leading-relaxed block">
              What drives me is the intersection of creativity and functionality. I believe in building tools and experiences that are not just beautiful, but genuinely useful and impactful for businesses and individuals.
            </FadeIn>
            <FadeIn delay={550} className="text-lg sm:text-xl text-muted-foreground leading-relaxed block">
              When I'm not coding or designing, I'm exploring new technologies, learning from the community, and continuously improving my craft. Every project is an opportunity to create something better.
            </FadeIn>

            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-primary">5+</h3>
                <FadeIn delay={700} className="text-foreground/75 block">
                  Projects Completed
                </FadeIn>
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-primary">1+</h3>
                <FadeIn delay={750} className="text-foreground/75 block">
                  Years in Tech
                </FadeIn>
              </div>
            </div>
          </div>
        </div>

        {/* Credentials & Education */}
        <div className="bg-card rounded-3xl p-8 sm:p-12 border border-border/50 mb-20">
          <FadeIn delay={800} className="text-3xl font-bold text-foreground mb-10">
            Credentials & Education
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Education */}
            <FadeIn delay={850} className="space-y-6">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full" />
                Education
              </h3>
              <div className="space-y-6">
                <div className="border-l-2 border-primary/30 pl-6">
                  <h4 className="font-bold text-foreground text-lg">Computer Science & Web Development</h4>
                  <p className="text-muted-foreground">University/Academy Name</p>
                  <p className="text-sm text-foreground/60"> graduation year</p>
                </div>
                <div className="border-l-2 border-primary/30 pl-6">
                  <h4 className="font-bold text-foreground text-lg">Self-Taught Web Development</h4>
                  <p className="text-muted-foreground">Online Platforms & Practical Experience</p>
                  <p className="text-sm text-foreground/60">2019 - Present</p>
                </div>
              </div>
            </FadeIn>

            {/* Certifications */}
            <FadeIn delay={950} className="space-y-6">
              <h3 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-primary rounded-full" />
                Certifications & Training
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border/30 bg-background/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Web Development Certification</h4>
                    <p className="text-sm text-muted-foreground">Institution Name</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-border/30 bg-background/50">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">UI/UX Design Training</h4>
                    <p className="text-sm text-muted-foreground">Design Platform</p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-card rounded-3xl p-8 sm:p-12 border border-border/50">
          <FadeIn delay={800} className="text-3xl font-bold text-foreground mb-12">
            Core Values
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Simplicity', desc: 'Clean code and intuitive design' },
              { title: 'User-First', desc: 'Focus on real user needs' },
              { title: 'Learning', desc: 'Always growing and evolving' },
              { title: 'Impact', desc: 'Creating meaningful solutions' },
            ].map((value, i) => (
              <FadeIn key={i} delay={i * 150} className="p-6 rounded-2xl border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 space-y-3">
                <h4 className="text-xl font-bold text-primary">{value.title}</h4>
                <p className="text-foreground/75 text-sm leading-relaxed">{value.desc}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
