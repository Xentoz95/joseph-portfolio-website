'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo with Brand Image */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150">
          <div className="w-10 h-10 rounded-lg overflow-hidden border border-primary/30">
            <Image
              src="/images/brand/logo.png"
              alt="Joseph Thuo Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xl font-bold text-primary">Joseph Thuo</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-1">
          <Link href="/#about" className="px-3 py-1.5 text-sm text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
            About
          </Link>
          <Link href="/#skills" className="px-3 py-1.5 text-sm text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
            Skills
          </Link>
          <Link href="/learning" className="px-3 py-1.5 text-sm text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
            Learning
          </Link>
          <Link href="/projects" className="px-3 py-1.5 text-sm text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
            Projects
          </Link>
          <Link href="/#services" className="px-3 py-1.5 text-sm text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
            Services
          </Link>
          <Link href="/contact" className="px-3 py-1.5 text-sm text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
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
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border/50 md:hidden">
            <div className="flex flex-col gap-1 p-4">
              <Link href="/#about" onClick={() => setIsOpen(false)} className="px-4 py-3 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
                About
              </Link>
              <Link href="/#skills" onClick={() => setIsOpen(false)} className="px-4 py-3 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
                Skills
              </Link>
              <Link href="/learning" onClick={() => setIsOpen(false)} className="px-4 py-3 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
                Learning
              </Link>
              <Link href="/projects" onClick={() => setIsOpen(false)} className="px-4 py-3 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
                Projects
              </Link>
              <Link href="/#services" onClick={() => setIsOpen(false)} className="px-4 py-3 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
                Services
              </Link>
              <Link href="/contact" onClick={() => setIsOpen(false)} className="px-4 py-3 text-foreground/90 hover:text-primary hover:bg-primary/10 rounded-lg transition-all duration-150">
                Contact
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
