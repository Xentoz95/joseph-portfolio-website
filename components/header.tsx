'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity">
          Joseph Thuo
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1">
          <Link href="#about" className="px-4 py-2 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
            About
          </Link>
          <Link href="#skills" className="px-4 py-2 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
            Skills
          </Link>
          <Link href="#projects" className="px-4 py-2 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
            Projects
          </Link>
          <Link href="#services" className="px-4 py-2 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
            Services
          </Link>
          <Link href="#contact" className="px-4 py-2 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
            Contact
          </Link>
        </div>

        {/* Mobile Navigation Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-foreground hover:text-primary"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur border-b border-border/50 md:hidden">
            <div className="flex flex-col gap-2 p-4">
              <Link href="#about" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
                About
              </Link>
              <Link href="#skills" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
                Skills
              </Link>
              <Link href="#projects" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
                Projects
              </Link>
              <Link href="#services" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
                Services
              </Link>
              <Link href="#contact" onClick={() => setIsOpen(false)} className="px-4 py-2.5 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-300">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
