'use client';

import Image from 'next/image';
import { FadeIn } from './FadeIn';
import { Star } from 'lucide-react';

interface Testimonial {
  id: number;
  clientName: string;
  clientRole: string;
  company: string;
  quote: string;
  projectType?: string;
  rating?: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    clientName: 'Sarah Johnson',
    clientRole: 'CEO',
    company: 'TechStart Solutions',
    quote: 'Joseph delivered an exceptional website that completely transformed our online presence. His attention to detail and commitment to quality is outstanding. The project was completed on time and on budget, and the results have exceeded our expectations.',
    projectType: 'Website Development',
    rating: 5,
  },
  {
    id: 2,
    clientName: 'Michael Chen',
    clientRole: 'Operations Manager',
    company: 'Global Logistics Inc',
    quote: 'Working with Joseph was a pleasure. He built a custom business system that has streamlined our operations significantly. His ability to understand our needs and translate them into a functional, user-friendly solution was impressive.',
    projectType: 'Business System',
    rating: 5,
  },
  {
    id: 3,
    clientName: 'Emily Rodriguez',
    clientRole: 'Project Lead',
    company: 'DataDrive Analytics',
    quote: 'Joseph is a talented developer who truly cares about his clients. The dashboard he created for us provides real-time insights that have helped us make better business decisions. I would highly recommend his services to anyone looking for professional, high-quality work.',
    projectType: 'Dashboard Development',
    rating: 5,
  },
  {
    id: 4,
    clientName: 'David Kimani',
    clientRole: 'Founder',
    company: 'AfriTrade Marketplace',
    quote: 'The e-commerce platform Joseph built for us has been a game-changer. Clean code, excellent UX, and great communication throughout the project. Our sales increased by 40% after the launch.',
    projectType: 'E-Commerce Platform',
    rating: 5,
  },
  {
    id: 5,
    clientName: 'Lisa Wang',
    clientRole: 'Marketing Director',
    company: 'Creative Pulse Agency',
    quote: "Joseph's design sensibility combined with technical skill made him the perfect partner for our redesign. He delivered a beautiful, fast, and accessible site that our users love.",
    projectType: 'Web Redesign',
    rating: 5,
  },
  {
    id: 6,
    clientName: 'Robert Ochieng',
    clientRole: 'IT Manager',
    company: 'SecureNet Systems',
    quote: 'The internal management system Joseph developed has automated many of our manual processes. His understanding of both business needs and technical implementation is rare and valuable.',
    projectType: 'Internal Management System',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary/10 relative overflow-hidden">
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
        <div className="space-y-6 mb-16 text-center">
          <FadeIn delay={100} className="text-primary font-semibold text-lg tracking-wide">
            What Clients Are Saying
          </FadeIn>
          <FadeIn delay={150} className="text-5xl sm:text-6xl font-bold text-foreground text-balance">
            Client Testimonials
          </FadeIn>
          <FadeIn delay={200} className="text-lg text-muted-foreground max-w-2xl mx-auto text-center">
            Don&apos;t just take my word for it. Here&apos;s what clients have to say about working with me.
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <FadeIn
              key={testimonial.id}
              delay={index * 100}
              className="bg-card rounded-2xl p-8 border border-border/50 shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30 transition-all duration-300 flex flex-col"
            >
              {/* Star rating */}
              {testimonial.rating && (
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                  ))}
                </div>
              )}

              {/* Quote */}
              <blockquote className="text-foreground/80 text-sm leading-relaxed mb-6 flex-grow">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>

              {/* Project type badge */}
              {testimonial.projectType && (
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {testimonial.projectType}
                  </span>
                </div>
              )}

              {/* Client info */}
              <div className="border-t border-border/30 pt-4 mt-auto">
                <h4 className="font-bold text-foreground">{testimonial.clientName}</h4>
                <p className="text-sm text-muted-foreground">
                  {testimonial.clientRole} at {testimonial.company}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8 sm:p-12 border border-primary/20 text-center">
          <FadeIn delay={100} className="text-3xl font-bold text-foreground mb-4">
            Ready to Join These Satisfied Clients?
          </FadeIn>
          <p className="text-foreground/70 mb-8 max-w-2xl mx-auto">
            I&apos;m committed to delivering the same level of quality and service that keeps clients coming back. Let&apos;s discuss your project and see how I can help you achieve your goals.
          </p>
          <a
            href="https://wa.me/254768682374"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/30 transform hover:-translate-y-1"
          >
            Start Your Project Today
          </a>
        </div>
      </div>
    </section>
  );
}
