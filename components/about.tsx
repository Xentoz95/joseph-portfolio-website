'use client';

import Image from 'next/image';
import { BlurText } from './blur-text';

export function About() {
  return (
    <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="space-y-6 mb-16">
          <BlurText
            text="Get to Know Me"
            className="text-primary font-semibold text-lg tracking-wide"
            delay={100}
            animateBy="words"
            direction="top"
          />
          <BlurText
            text="About Me & My Journey"
            className="text-5xl sm:text-6xl font-bold text-foreground text-balance"
            delay={150}
            animateBy="words"
            direction="top"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative w-80 h-96 rounded-3xl overflow-hidden border-4 border-primary/20 shadow-2xl hover:shadow-primary/40 transition-all duration-300 group">
              <Image
                src="/images/profile/WhatsApp Image 2025-12-08 at 10.05.02 AM.jpeg"
                alt="Joseph Thuo - Portrait"
                fill
                className="object-cover object-top group-hover:scale-110 transition-transform duration-500"
                sizes="(max-width: 640px) 320px, 400px"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2 space-y-6">
            <BlurText
              text="I'm Joseph Thuo, a passionate Full Stack Developer with a hands-on approach to solving problems. My journey spans from learning the fundamentals of web development to building complex systems and digital solutions for real-world challenges."
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed block"
              delay={250}
              animateBy="words"
              direction="bottom"
            />
            <BlurText
              text="What drives me is the intersection of creativity and functionality. I believe in building tools and experiences that are not just beautiful, but genuinely useful and impactful for businesses and individuals."
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed block"
              delay={400}
              animateBy="words"
              direction="bottom"
            />
            <BlurText
              text="When I'm not coding or designing, I'm exploring new technologies, learning from the community, and continuously improving my craft. Every project is an opportunity to create something better."
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed block"
              delay={550}
              animateBy="words"
              direction="bottom"
            />

            <div className="grid grid-cols-2 gap-8 pt-6">
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-primary">10+</h3>
                <BlurText
                  text="Projects Completed"
                  className="text-foreground/75 block"
                  delay={700}
                  animateBy="words"
                  direction="bottom"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-bold text-primary">5+</h3>
                <BlurText
                  text="Years in Tech"
                  className="text-foreground/75 block"
                  delay={750}
                  animateBy="words"
                  direction="bottom"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-background rounded-3xl p-8 sm:p-12 border border-border/50">
          <BlurText
            text="Core Values"
            className="text-3xl font-bold text-foreground mb-12"
            delay={800}
            animateBy="words"
            direction="top"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: 'Simplicity', desc: 'Clean code and intuitive design' },
              { title: 'User-First', desc: 'Focus on real user needs' },
              { title: 'Learning', desc: 'Always growing and evolving' },
              { title: 'Impact', desc: 'Creating meaningful solutions' },
            ].map((value, i) => (
              <div key={i} className="p-6 rounded-2xl border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 space-y-3">
                <h4 className="text-xl font-bold text-primary">{value.title}</h4>
                <p className="text-foreground/75 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
