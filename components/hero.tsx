'use client';

import Image from 'next/image';
import { Github, Linkedin, Mail, MessageCircle, Star, Clock, CheckCircle } from 'lucide-react';

export function Hero() {
  return (
    <section className="min-h-screen pt-16 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Brand Background Image - Subtle Watermark */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/brand/4.png"
          alt=""
          fill
          className="object-cover opacity-[0.07] grayscale"
          priority
        />
      </div>

      {/* Orange gradient overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary/10 via-background/80 to-background" />

      <div className="w-full max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Content - Left Side */}
          <div className="space-y-6 pt-8 lg:pt-12 order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight">
              <span className="text-primary">Hello!</span> I&apos;m Joseph Thuo
            </h1>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
              Let&apos;s Build Something{' '}
              <span className="text-primary">Amazing</span> Together
            </h2>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary leading-tight">
              Full Stack Developer & System Builder
            </h3>

            <p className="text-lg sm:text-xl text-foreground/70 leading-relaxed max-w-lg">
              I specialize in crafting high quality web applications and business systems that solve real problems. With 5+ years of experience and a focus on client satisfaction, I deliver solutions that exceed expectations.
            </p>

            <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
              Every project starts with understanding your unique needs. I&apos;m committed to clear communication, timely delivery, and quality that speaks for itself.
            </p>

            {/* Quick trust indicators */}
            <div className="flex flex-wrap gap-6 pt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                <span>100% Client Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Quick Response Time</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <span>Quality Guaranteed</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="https://github.com/josephthuo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
              <a
                href="https://linkedin.com/in/josephthuo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
              <a
                href="mailto:thuojesseph405@gmail.com"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background font-semibold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
                Email
              </a>
              <a
                href="https://wa.me/254768682374"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-all duration-200 shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href="https://wa.me/254768682374"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-all duration-200 shadow-lg"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Your Project Today
              </a>
              <a
                href="#testimonials"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-foreground/20 text-foreground font-semibold rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200"
              >
                See What Clients Say
              </a>
            </div>
          </div>

          {/* Profile Image - Right Side, Full Height, Pushed to Top */}
          <div className="flex items-start justify-end order-1 lg:order-2">
            <div className="relative w-full h-[400px] sm:h-[450px] lg:h-[calc(100vh-8rem)] lg:min-h-[500px] lg:max-h-[800px] lg:-mt-8 rounded-3xl overflow-hidden border-4 border-primary/20 shadow-2xl hover:shadow-primary/40 transition-all duration-300 group bg-white">
              <Image
                src="/images/profile/WhatsApp Image 2025-12-08 at 10.05.16 AM.jpeg"
                alt="Joseph Thuo - Full Stack Developer"
                fill
                className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />

              {/* Orange gradient overlay for depth on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Floating experience badge */}
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-300">
                <div className="text-center">
                  <div className="text-xl font-bold">1+</div>
                  <div className="text-[10px]">Years Exp.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
