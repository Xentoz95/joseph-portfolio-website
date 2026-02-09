'use client';

import { useRef, useEffect, type RefObject } from 'react';

interface Letter {
  char: string;
  color: string;
  targetColor: string;
  colorProgress: number;
}

interface Grid {
  columns: number;
  rows: number;
}

interface LetterGlitchProps {
  glitchColors?: string[];
  glitchSpeed?: number;
  centerVignette?: boolean;
  outerVignette?: boolean;
  smooth?: boolean;
  characters?: string;
}

const LetterGlitch = ({
  glitchColors = ['#2b4539', '#61dca3', '#61b3dc'],
  glitchSpeed = 50,
  centerVignette = false,
  outerVignette = true,
  smooth = true,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$&*()-_+=/[]{};:<>.,0123456789'
}: LetterGlitchProps) => {
  const canvasRef: RefObject<HTMLCanvasElement | null> = useRef(null);
  const animationRef: RefObject<number | null> = useRef(null);
  const lettersRef = useRef<Letter[]>([]);
  const gridRef = useRef<Grid>({ columns: 0, rows: 0 });
  const contextRef: RefObject<CanvasRenderingContext2D | null> = useRef(null);
  const lastGlitchTimeRef = useRef<number>(Date.now());

  const lettersAndSymbols = Array.from(characters);

  const fontSize = 16;
  const charWidth = 10;
  const charHeight = 20;

  const getRandomChar = (): string => {
    return lettersAndSymbols[Math.floor(Math.random() * lettersAndSymbols.length)];
  };

  const getRandomColor = (): string => {
    return glitchColors[Math.floor(Math.random() * glitchColors.length)];
  };

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const interpolateColor = (
    start: { r: number; g: number; b: number },
    end: { r: number; g: number; b: number },
    factor: number
  ): string => {
    const result = {
      r: Math.round(start.r + (end.r - start.r) * factor),
      g: Math.round(start.g + (end.g - start.g) * factor),
      b: Math.round(start.b + (end.b - start.b) * factor)
    };
    return `rgb(${result.r}, ${result.g}, ${result.b})`;
  };

  const calculateGrid = (width: number, height: number): Grid => {
    const columns = Math.ceil(width / charWidth);
    const rows = Math.ceil(height / charHeight);
    return { columns, rows };
  };

  const initializeLetters = (columns: number, rows: number): void => {
    gridRef.current = { columns, rows };
    const totalLetters = columns * rows;
    lettersRef.current = Array.from({ length: totalLetters }, () => ({
      char: getRandomChar(),
      color: getRandomColor(),
      targetColor: getRandomColor(),
      colorProgress: 1
    }));
  };

  const resizeCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    if (contextRef.current) {
      contextRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const { columns, rows } = calculateGrid(rect.width, rect.height);
    initializeLetters(columns, rows);

    drawLetters();
  };

  const drawLetters = (): void => {
    if (!contextRef.current || lettersRef.current.length === 0) return;
    const ctx = contextRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    ctx.font = `${fontSize}px monospace`;
    ctx.textBaseline = 'top';

    lettersRef.current.forEach((letter) => {
      const x = (lettersRef.current.indexOf(letter) % gridRef.current.columns) * charWidth;
      const y = Math.floor(lettersRef.current.indexOf(letter) / gridRef.current.columns) * charHeight;
      ctx.fillStyle = letter.color;
      ctx.fillText(letter.char, x, y);
    });
  };

  const updateLetters = (): void => {
    if (!lettersRef.current || lettersRef.current.length === 0) return;

    const updateCount = Math.max(1, Math.floor(lettersRef.current.length * 0.05));

    for (let i = 0; i < updateCount; i++) {
      const index = Math.floor(Math.random() * lettersRef.current.length);
      if (!lettersRef.current[index]) continue;

      lettersRef.current[index].char = getRandomChar();
      lettersRef.current[index].targetColor = getRandomColor();

      if (!smooth) {
        lettersRef.current[index].color = lettersRef.current[index].targetColor;
        lettersRef.current[index].colorProgress = 1;
      } else {
        lettersRef.current[index].colorProgress = 0;
      }
    }
  };

  const handleSmoothTransitions = (): void => {
    let needsRedraw = false;
    lettersRef.current.forEach(letter => {
      if (letter.colorProgress < 1) {
        letter.colorProgress += 0.05;
        if (letter.colorProgress > 1) letter.colorProgress = 1;

        const startRgb = hexToRgb(letter.color);
        const endRgb = hexToRgb(letter.targetColor);
        if (startRgb && endRgb) {
          letter.color = interpolateColor(startRgb, endRgb, letter.colorProgress);
          needsRedraw = true;
        }
      }
    });

    if (needsRedraw) {
      drawLetters();
    }
  };

  const animate = (): void => {
    const now = Date.now();
    if (now - lastGlitchTimeRef.current >= glitchSpeed) {
      updateLetters();
      drawLetters();
      lastGlitchTimeRef.current = now;
    }

    if (smooth) {
      handleSmoothTransitions();
    }

    const animationId = requestAnimationFrame(animate);
    animationRef.current = animationId;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    contextRef.current = canvas.getContext('2d');
    resizeCanvas();
    animate();

    let resizeTimeout: number | undefined;

    const handleResize = () => {
      if (resizeTimeout !== undefined) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(() => {
        if (animationRef.current !== null) {
          cancelAnimationFrame(animationRef.current);
        }
        resizeCanvas();
        animate();
      }, 100);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [glitchSpeed, smooth]);

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {outerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0)_60%,_rgba(0,0,0,1)_100%)]"></div>
      )}
      {centerVignette && (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[radial-gradient(circle,_rgba(0,0,0,0.8)_0%,_rgba(0,0,0,0)_60%)]"></div>
      )}
    </div>
  );
};

export default LetterGlitch;
