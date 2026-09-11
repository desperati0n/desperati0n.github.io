'use client';

import { useEffect, useRef } from 'react';

type VaporizeAnimationTextProps = {
  texts: string[];
  className?: string;
  color?: string;
  enterDuration?: number;
  ariaLabel?: string;
};

type Particle = {
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  size: number;
  drift: number;
  lift: number;
  delay: number;
  phase: number;
};

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const easeOutCubic = (value: number) => 1 - Math.pow(1 - value, 3);

export function VaporizeAnimationText({
  texts,
  className = '',
  color = '#ffffff',
  enterDuration = 1100,
  ariaLabel,
}: VaporizeAnimationTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || texts.length === 0) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let entranceStartedAt = performance.now();
    let departureProgress = 0;

    const createParticles = (text: string) => {
      const buffer = document.createElement('canvas');
      buffer.width = Math.max(1, Math.floor(width));
      buffer.height = Math.max(1, Math.floor(height));
      const bufferContext = buffer.getContext('2d', { willReadFrequently: true });
      if (!bufferContext) return [];

      const fontSize = clamp(width * 0.085, 36, 82);
      const lineHeight = fontSize * 1.18;
      const maxLineWidth = width * 0.92;
      const lines: string[] = [];
      let currentLine = '';

      bufferContext.font = `700 ${fontSize}px ui-sans-serif, system-ui, "Microsoft YaHei", sans-serif`;
      for (const character of text) {
        const candidate = currentLine + character;
        if (currentLine && bufferContext.measureText(candidate).width > maxLineWidth) {
          lines.push(currentLine);
          currentLine = character;
        } else {
          currentLine = candidate;
        }
      }
      if (currentLine) lines.push(currentLine);

      bufferContext.clearRect(0, 0, width, height);
      bufferContext.fillStyle = color;
      bufferContext.textAlign = 'center';
      bufferContext.textBaseline = 'middle';
      const blockHeight = lines.length * lineHeight;
      const firstLineY = height / 2 - blockHeight / 2 + lineHeight / 2;
      lines.forEach((line, index) => bufferContext.fillText(line, width / 2, firstLineY + index * lineHeight));

      const pixels = bufferContext.getImageData(0, 0, buffer.width, buffer.height).data;
      const gap = width < 520 ? 4 : 5;
      const nextParticles: Particle[] = [];

      for (let y = 0; y < height; y += gap) {
        for (let x = 0; x < width; x += gap) {
          const alpha = pixels[(Math.floor(y) * buffer.width + Math.floor(x)) * 4 + 3];
          if (alpha < 96) continue;

          const phase = Math.random() * Math.PI * 2;
          const distance = 28 + Math.random() * 72;
          nextParticles.push({
            targetX: x,
            targetY: y,
            startX: x + Math.cos(phase) * distance,
            startY: y + Math.sin(phase) * distance + 26,
            size: gap * (0.42 + Math.random() * 0.25),
            drift: (Math.random() - 0.5) * 58,
            lift: 52 + Math.random() * 110,
            delay: Math.random() * 0.22 + (1 - y / Math.max(height, 1)) * .16,
            phase,
          });
        }
      }

      return nextParticles;
    };

    const scheduleDraw = () => {
      if (animationFrame === 0) animationFrame = window.requestAnimationFrame(draw);
    };

    const draw = (timestamp: number) => {
      animationFrame = 0;
      const entrance = reduceMotion.matches ? 1 : easeOutCubic(clamp((timestamp - entranceStartedAt) / enterDuration));

      context.clearRect(0, 0, width, height);
      context.fillStyle = color;

      for (const particle of particles) {
        const departureDelay = particle.delay * 0.45;
        const vapor = reduceMotion.matches ? 0 : clamp((departureProgress - departureDelay) / (1 - departureDelay));
        const vaporEase = vapor * vapor;
        const breakup = Math.sin(particle.phase + vapor * Math.PI) * vapor * 1.4;
        const x = particle.startX + (particle.targetX - particle.startX) * entrance + particle.drift * vaporEase + breakup;
        const y = particle.startY + (particle.targetY - particle.startY) * entrance - particle.lift * vaporEase;
        const opacity = clamp(entrance * (1 - vapor));

        if (opacity <= 0.01) continue;
        context.globalAlpha = opacity;
        context.beginPath();
        context.arc(x, y, Math.max(0.3, particle.size * (1 - vapor * 0.62)), 0, Math.PI * 2);
        context.fill();
      }

      context.globalAlpha = 1;
      if (entrance < 0.999) scheduleDraw();
    };

    const updateDeparture = () => {
      const bounds = container.getBoundingClientRect();
      const departureDistance = Math.max(0, -bounds.top);
      const departureRange = Math.max(height * 0.95, window.innerHeight * 0.38);
      departureProgress = clamp(departureDistance / departureRange);
      scheduleDraw();
    };

    const resize = () => {
      const bounds = container.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * pixelRatio);
      canvas.height = Math.floor(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particles = createParticles(texts[0]);
      entranceStartedAt = performance.now();
      updateDeparture();
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    window.addEventListener('scroll', updateDeparture, { passive: true });
    scheduleDraw();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', updateDeparture);
      window.cancelAnimationFrame(animationFrame);
    };
  }, [color, enterDuration, texts]);

  return (
    <div ref={containerRef} className={`relative ${className}`} role="img" aria-label={ariaLabel ?? texts.join('，')}>
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 block h-full w-full" />
    </div>
  );
}
