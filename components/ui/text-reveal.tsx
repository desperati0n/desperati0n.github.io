'use client';

import {
  motion,
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { useMemo, useRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

type TextElement = 'h1' | 'h2' | 'h3' | 'p' | 'span';

interface SharedTextRevealProps {
  children: string;
  as?: TextElement;
  textClassName?: string;
  mutedClassName?: string;
}

export interface TextRevealProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    SharedTextRevealProps {
  contentClassName?: string;
}

export interface InlineTextRevealProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'children'>,
    SharedTextRevealProps {}

function segmentText(text: string) {
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'word' });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }

  return text.split(/(\s+)/).filter(Boolean);
}

function RevealToken({
  children,
  progress,
  range,
  mutedClassName,
}: {
  children: ReactNode;
  progress: MotionValue<number>;
  range: [number, number];
  mutedClassName?: string;
}) {
  const opacity = useTransform(progress, range, [0, 1]);
  const prefersReducedMotion = useReducedMotion();

  return (
    <span aria-hidden="true" className="relative inline-block">
      <span className={cn('text-white/20', mutedClassName)}>{children}</span>
      <motion.span
        className="absolute inset-0 text-current"
        style={{ opacity: prefersReducedMotion ? 1 : opacity }}
      >
        {children}
      </motion.span>
    </span>
  );
}

function RevealedText({
  children,
  progress,
  as: Tag = 'p',
  className,
  mutedClassName,
}: SharedTextRevealProps & {
  progress: MotionValue<number>;
  className?: string;
}) {
  const segments = useMemo(() => segmentText(children), [children]);
  const revealableCount = Math.max(
    1,
    segments.filter((segment) => !/^\s+$/.test(segment)).length,
  );

  return (
    <Tag aria-label={children} className={cn('flex flex-wrap', className)}>
      {segments.map((segment, index) => {
        if (/^\s+$/.test(segment)) {
          if (segment.includes('\n')) {
            return <span key={`${segment}-${index}`} aria-hidden="true" className="h-0 basis-full" />;
          }

          return (
            <span key={`${segment}-${index}`} aria-hidden="true" className="whitespace-pre">
              {segment}
            </span>
          );
        }

        const revealIndex = segments
          .slice(0, index)
          .filter((previousSegment) => !/^\s+$/.test(previousSegment)).length;
        const start = revealIndex / revealableCount;
        const end = (revealIndex + 1) / revealableCount;

        return (
          <RevealToken
            key={`${segment}-${index}`}
            progress={progress}
            range={[start, end]}
            mutedClassName={mutedClassName}
          >
            {segment}
          </RevealToken>
        );
      })}
    </Tag>
  );
}

/** Dillion Verma / Magic UI-style sticky scroll text reveal. */
export function TextReveal({
  children,
  className,
  contentClassName,
  textClassName,
  mutedClassName,
  as,
  ...props
}: TextRevealProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={sectionRef} className={cn('relative h-[180vh]', className)} {...props}>
      <div
        className={cn(
          'sticky top-0 flex h-screen items-center bg-transparent',
          contentClassName,
        )}
      >
        <RevealedText
          progress={scrollYProgress}
          as={as}
          textClassName={textClassName}
          mutedClassName={mutedClassName}
          className={textClassName}
        >
          {children}
        </RevealedText>
      </div>
    </div>
  );
}

/** Compact variant for headings that should reveal without adding a sticky chapter. */
export function InlineTextReveal({
  children,
  className,
  textClassName,
  mutedClassName,
  as,
  ...props
}: InlineTextRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start 88%', 'end 30%'],
  });

  return (
    <div ref={rootRef} className={className} {...props}>
      <RevealedText
        progress={scrollYProgress}
        as={as}
        textClassName={textClassName}
        mutedClassName={mutedClassName}
        className={textClassName}
      >
        {children}
      </RevealedText>
    </div>
  );
}
