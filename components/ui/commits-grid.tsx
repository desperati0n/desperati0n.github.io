'use client';

import type { CSSProperties } from 'react';

type CommitsGridProps = {
  text: string;
  ariaLabel?: string;
  className?: string;
};

const glyphs: Record<string, number[]> = {
  A: [1, 2, 3, 50, 100, 150, 200, 250, 300, 54, 104, 154, 204, 254, 304, 151, 152, 153],
  B: [0, 1, 2, 3, 4, 50, 100, 150, 151, 200, 250, 300, 301, 302, 303, 304, 54, 104, 152, 153, 204, 254, 303],
  C: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  D: [0, 1, 2, 3, 50, 100, 150, 200, 250, 300, 301, 302, 54, 104, 154, 204, 254, 303],
  E: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304, 151, 152],
  F: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 151, 152, 153],
  G: [0, 1, 2, 3, 4, 50, 100, 150, 200, 250, 300, 301, 302, 303, 153, 154, 204, 254, 304],
  H: [0, 50, 100, 150, 200, 250, 300, 151, 152, 153, 4, 54, 104, 154, 204, 254, 304],
  I: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 300, 301, 302, 303, 304],
  J: [0, 1, 2, 3, 4, 52, 102, 152, 202, 250, 252, 300, 301, 302],
  K: [0, 4, 50, 100, 150, 200, 250, 300, 54, 103, 151, 152, 203, 254, 304],
  L: [0, 50, 100, 150, 200, 250, 300, 301, 302, 303, 304],
  M: [0, 50, 100, 150, 200, 250, 300, 51, 102, 53, 4, 54, 104, 154, 204, 254, 304],
  N: [0, 50, 100, 150, 200, 250, 300, 51, 102, 153, 204, 4, 54, 104, 154, 254, 304],
  O: [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 303, 54, 104, 154, 204, 254],
  P: [0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153],
  Q: [1, 2, 3, 50, 100, 150, 200, 250, 301, 302, 54, 104, 154, 202, 204, 253, 304],
  R: [0, 50, 100, 150, 200, 250, 300, 1, 2, 3, 54, 104, 151, 152, 153, 204, 254, 304],
  S: [1, 2, 3, 4, 50, 100, 151, 152, 153, 204, 254, 300, 301, 302, 303],
  T: [0, 1, 2, 3, 4, 52, 102, 152, 202, 252, 302],
  U: [0, 50, 100, 150, 200, 250, 301, 302, 303, 4, 54, 104, 154, 204, 254],
  V: [0, 50, 100, 150, 200, 251, 302, 4, 54, 104, 154, 204, 253],
  W: [0, 50, 100, 150, 200, 250, 301, 152, 202, 252, 4, 54, 104, 154, 204, 254, 303],
  X: [0, 50, 101, 103, 152, 201, 203, 250, 254, 300, 304, 4, 54],
  Y: [0, 50, 101, 103, 152, 202, 252, 302, 4, 54],
  Z: [0, 1, 2, 3, 4, 54, 103, 152, 201, 250, 300, 301, 302, 303, 304],
  ' ': [],
};

function buildGrid(text: string) {
  const safeText = text
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split('')
    .filter((character) => character in glyphs)
    .join('');
  const width = Math.max(safeText.length * 6, 6) + 1;
  const cells: number[] = [];
  let offset = 1;

  safeText.split('').forEach((character) => {
    glyphs[character].forEach((cell) => {
      const row = Math.floor(cell / 50);
      const column = cell % 50;
      cells.push((row + 1) * width + column + offset);
    });
    offset += 6;
  });

  return { activeCells: new Set(cells), width, height: 9 };
}

const highlights = ['#48d55d', '#016d32', '#0d4429'];

export function CommitsGrid({ text, ariaLabel, className = '' }: CommitsGridProps) {
  const { activeCells, width, height } = buildGrid(text);

  return (
    <section
      role="img"
      aria-label={ariaLabel ?? text}
      className={`grid w-full gap-0.5 rounded-[10px] border border-white/10 bg-black/45 p-1.5 shadow-2xl backdrop-blur-sm sm:gap-1 sm:rounded-[15px] sm:p-3 ${className}`}
      style={{ gridTemplateColumns: `repeat(${width}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${height}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: width * height }).map((_, index) => {
        const active = activeCells.has(index);
        const flash = !active && (index * 17 + text.length * 13) % 31 === 0;
        const highlight = highlights[(index + text.length) % highlights.length];
        const style = {
          animationDelay: `${((index * 7) % 6) / 10}s`,
          '--highlight': highlight,
        } as CSSProperties;

        return (
          <span
            key={index}
            className={`aspect-square h-full w-full rounded-[2px] border border-white/[0.08] sm:rounded-[3px] ${active ? 'animate-commit-highlight' : flash ? 'animate-commit-flash' : 'bg-black/35'}`}
            style={style}
          />
        );
      })}
    </section>
  );
}
