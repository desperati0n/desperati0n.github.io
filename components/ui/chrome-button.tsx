'use client';

import {
  forwardRef,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from 'react';

import { cn } from '@/lib/utils';
import LiquidChrome from '@/components/ui/liquid-chrome';

type ChromeVariant = 'pill' | 'icon' | 'panel' | 'surface';
type Ripple = { id: number; x: number; y: number };

type ChromeVisualProps = {
  children: ReactNode;
  variant: ChromeVariant;
  shader?: boolean;
  labelClassName?: string;
};

type ChromeButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ChromeVariant;
  shader?: boolean;
  labelClassName?: string;
};

type ChromeLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: ChromeVariant;
  shader?: boolean;
  labelClassName?: string;
};

const variantClasses: Record<ChromeVariant, string> = {
  pill: 'min-h-12 rounded-full px-6 py-3',
  icon: 'size-12 rounded-full p-0',
  panel: 'h-full min-h-[150px] w-full items-stretch justify-stretch rounded-3xl p-0 text-left',
  surface: 'block w-full rounded-lg p-0 text-left',
};

function useRipples() {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextId = useRef(0);

  const addRipple = (event: ReactMouseEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const ripple = {
      id: nextId.current++,
      x: event.detail === 0 ? bounds.width / 2 : event.clientX - bounds.left,
      y: event.detail === 0 ? bounds.height / 2 : event.clientY - bounds.top,
    };
    setRipples((current) => [...current, ripple]);
    window.setTimeout(
      () => setRipples((current) => current.filter(({ id }) => id !== ripple.id)),
      600,
    );
  };

  return { ripples, addRipple };
}

function ChromeVisual({ children, variant, shader = true, labelClassName }: ChromeVisualProps) {
  return (
    <>
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 bg-[conic-gradient(from_125deg,#090909,#f8f8ff,#222,#d8d8df,#090909,#eee,#111)] opacity-45"
      />
      {shader && (
        <span aria-hidden="true" className="absolute inset-0 z-[1] opacity-80 transition-opacity duration-500 group-hover/chrome:opacity-100">
          <LiquidChrome />
        </span>
      )}
      <div
        className={cn(
          'relative z-10 inline-flex w-full items-center justify-center gap-2 mix-blend-difference',
          variant === 'panel' && 'h-full items-stretch justify-stretch',
          variant === 'surface' && 'block',
          labelClassName,
        )}
      >
        {children}
      </div>
    </>
  );
}

const sharedClasses =
  'group/chrome relative isolate inline-flex cursor-pointer items-center justify-center overflow-hidden border-2 border-neutral-900 bg-neutral-950 text-white shadow-lg transition-[transform,box-shadow,border-color] duration-100 hover:border-neutral-700 hover:shadow-[0_12px_36px_rgba(255,255,255,.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/85 focus-visible:ring-offset-4 focus-visible:ring-offset-black active:scale-95 disabled:pointer-events-none disabled:opacity-45';

const ChromeButton = forwardRef<HTMLButtonElement, ChromeButtonProps>(function ChromeButton(
  {
    children,
    className,
    variant = 'pill',
    shader = true,
    labelClassName,
    onClick,
    type = 'button',
    ...props
  },
  ref,
) {
  const { ripples, addRipple } = useRipples();

  return (
    <button
      ref={ref}
      type={type}
      className={cn(sharedClasses, variantClasses[variant], className)}
      onClick={(event) => {
        addRipple(event);
        onClick?.(event);
      }}
      {...props}
    >
      <ChromeVisual variant={variant} shader={shader} labelClassName={labelClassName}>
        {children}
      </ChromeVisual>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          className="chrome-button-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </button>
  );
});

const ChromeLink = forwardRef<HTMLAnchorElement, ChromeLinkProps>(function ChromeLink(
  {
    children,
    className,
    variant = 'pill',
    shader = true,
    labelClassName,
    onClick,
    href,
    ...props
  },
  ref,
) {
  const { ripples, addRipple } = useRipples();

  return (
    <a
      ref={ref}
      href={href}
      className={cn(sharedClasses, variantClasses[variant], className)}
      onClick={(event) => {
        addRipple(event);
        onClick?.(event);
      }}
      {...props}
    >
      <ChromeVisual variant={variant} shader={shader} labelClassName={labelClassName}>
        {children}
      </ChromeVisual>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          className="chrome-button-ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </a>
  );
});

export { ChromeButton, ChromeLink, type ChromeButtonProps, type ChromeLinkProps };
