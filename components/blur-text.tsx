'use client';

import { useEffect, useRef, useState } from 'react';

interface BlurTextProps {
  text?: string;
  delay?: number;
  className?: string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
}

export function BlurText({
  text = '',
  delay = 50,
  className = '',
  animateBy = 'words',
  direction = 'top',
}: BlurTextProps) {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(ref.current!);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`flex flex-wrap ${className}`}>
      {elements.map((segment, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-500 ${
            direction === 'top' ? '-translate-y-4' : 'translate-y-4'
          } ${visible ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}
          style={{
            transitionDelay: `${index * delay}ms`,
            willChange: 'transform, opacity, filter',
          }}
        >
          {segment === ' ' ? '\u00A0' : segment}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </span>
      ))}
    </div>
  );
}
