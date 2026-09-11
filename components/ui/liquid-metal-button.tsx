'use client';

import {
  ShaderMount,
  liquidMetalFragmentShader,
  type ShaderMountUniforms,
} from '@paper-design/shaders';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
} from 'react';

import { cn } from '@/lib/utils';

type LiquidMetalVariant = 'default' | 'ghost' | 'panel' | 'icon';
type LiquidMetalSize = 'default' | 'sm' | 'icon';

type LiquidMetalButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: LiquidMetalVariant;
  size?: LiquidMetalSize;
};

type LiquidMetalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  href: string;
  variant?: Exclude<LiquidMetalVariant, 'panel'>;
  size?: LiquidMetalSize;
};

type Ripple = { id: number; x: number; y: number };

const sharedShaderUniforms: ShaderMountUniforms = {
  u_colorBack: [0, 0, 0, 0],
  u_colorTint: [1, 1, 1, 0],
  u_imageAspectRatio: 1,
  u_isImage: false,
  u_repetition: 4,
  u_softness: 0.5,
  u_shiftRed: 0.3,
  u_shiftBlue: 0.3,
  u_distortion: 0,
  u_contour: 0,
  u_angle: 45,
  u_fit: 0,
  u_rotation: 0,
  u_originX: 0.5,
  u_originY: 0.5,
  u_worldWidth: 0,
  u_worldHeight: 0,
  u_offsetX: 0.1,
  u_offsetY: -0.1,
};

const buttonShaderUniforms: ShaderMountUniforms = {
  ...sharedShaderUniforms,
  u_scale: 8,
  u_shape: 1,
};

const panelShaderUniforms: ShaderMountUniforms = {
  ...sharedShaderUniforms,
  u_scale: 1,
  u_shape: 0,
};

function useLiquidMetalShader(panel: boolean) {
  const shaderElement = useRef<HTMLDivElement>(null);
  const shader = useRef<ShaderMount | null>(null);

  useEffect(() => {
    if (!shaderElement.current) return;

    try {
      shader.current = new ShaderMount(
        shaderElement.current,
        liquidMetalFragmentShader,
        panel ? panelShaderUniforms : buttonShaderUniforms,
        { alpha: true, antialias: true },
        0.6,
      );
    } catch (error) {
      console.error('[LiquidMetalButton] Failed to load shader:', error);
    }

    return () => {
      shader.current?.dispose();
      shader.current = null;
    };
  }, [panel]);

  return { shaderElement, shader };
}

function useLiquidMetalInteraction(panel: boolean) {
  const { shaderElement, shader } = useLiquidMetalShader(panel);
  const [pressed, setPressed] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextRippleId = useRef(0);
  const speedTimer = useRef<number | undefined>(undefined);
  const rippleTimers = useRef<number[]>([]);

  useEffect(
    () => () => {
      window.clearTimeout(speedTimer.current);
      rippleTimers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  function enter() {
    setHovered(true);
    shader.current?.setSpeed(1);
  }

  function leave() {
    setHovered(false);
    setPressed(false);
    shader.current?.setSpeed(0.6);
  }

  function click(event: ReactMouseEvent<HTMLElement>) {
    shader.current?.setSpeed(2.4);
    window.clearTimeout(speedTimer.current);
    speedTimer.current = window.setTimeout(
      () => shader.current?.setSpeed(hovered ? 1 : 0.6),
      300,
    );

    const bounds = event.currentTarget.getBoundingClientRect();
    const keyboardClick = event.detail === 0;
    const ripple = {
      id: nextRippleId.current++,
      x: keyboardClick ? bounds.width / 2 : event.clientX - bounds.left,
      y: keyboardClick ? bounds.height / 2 : event.clientY - bounds.top,
    };
    setRipples((current) => [...current, ripple]);
    const timer = window.setTimeout(
      () => setRipples((current) => current.filter(({ id }) => id !== ripple.id)),
      600,
    );
    rippleTimers.current.push(timer);
  }

  return {
    shaderElement,
    pressed,
    hovered,
    ripples,
    enter,
    leave,
    click,
    press: () => setPressed(true),
    release: () => setPressed(false),
  };
}

function LiquidMetalVisual({
  children,
  labelId,
  shaderElement,
}: {
  children: ReactNode;
  labelId: string;
  shaderElement: RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <div id={labelId} className="liquid-metal-button__label">
        {children}
      </div>
      <div className="liquid-metal-button__surface" aria-hidden="true">
        <div className="liquid-metal-button__surface-inner" />
      </div>
      <div className="liquid-metal-button__metal" aria-hidden="true">
        <div ref={shaderElement} className="liquid-metal-button__shader" />
      </div>
    </>
  );
}

function RippleLayer({ ripples }: { ripples: Ripple[] }) {
  return (
    <>
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="liquid-metal-button__ripple"
          style={{ left: ripple.x, top: ripple.y }}
        />
      ))}
    </>
  );
}

function LiquidMetalButton({
  className,
  children,
  variant = 'default',
  size = 'default',
  disabled,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onBlur,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: LiquidMetalButtonProps) {
  const interaction = useLiquidMetalInteraction(variant === 'panel');
  const generatedLabelId = useId();
  const labelId = ariaLabelledBy ?? generatedLabelId;

  return (
    <div
      className={cn(
        'liquid-metal-button',
        `liquid-metal-button--${variant}`,
        `liquid-metal-button--${size}`,
        className,
      )}
      data-disabled={disabled || undefined}
      data-hovered={interaction.hovered || undefined}
      data-pressed={interaction.pressed || undefined}
    >
      <div className="liquid-metal-button__perspective">
        <div className="liquid-metal-button__frame">
          <LiquidMetalVisual
            labelId={generatedLabelId}
            shaderElement={interaction.shaderElement}
          >
            {children}
          </LiquidMetalVisual>
          <button
            className="liquid-metal-button__trigger"
            disabled={disabled}
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel ? ariaLabelledBy : labelId}
            onMouseEnter={(event) => {
              interaction.enter();
              onMouseEnter?.(event);
            }}
            onMouseLeave={(event) => {
              interaction.leave();
              onMouseLeave?.(event);
            }}
            onMouseDown={(event) => {
              interaction.press();
              onMouseDown?.(event);
            }}
            onMouseUp={(event) => {
              interaction.release();
              onMouseUp?.(event);
            }}
            onBlur={(event) => {
              interaction.release();
              onBlur?.(event);
            }}
            onClick={(event) => {
              interaction.click(event);
              onClick?.(event);
            }}
            {...props}
          >
            <RippleLayer ripples={interaction.ripples} />
          </button>
        </div>
      </div>
    </div>
  );
}

function LiquidMetalLink({
  href,
  className,
  children,
  variant = 'default',
  size = 'default',
  onClick,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  onBlur,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: LiquidMetalLinkProps) {
  const interaction = useLiquidMetalInteraction(false);
  const generatedLabelId = useId();
  const labelId = ariaLabelledBy ?? generatedLabelId;

  return (
    <div
      className={cn(
        'liquid-metal-button',
        `liquid-metal-button--${variant}`,
        `liquid-metal-button--${size}`,
        className,
      )}
      data-hovered={interaction.hovered || undefined}
      data-pressed={interaction.pressed || undefined}
    >
      <div className="liquid-metal-button__perspective">
        <div className="liquid-metal-button__frame">
          <LiquidMetalVisual
            labelId={generatedLabelId}
            shaderElement={interaction.shaderElement}
          >
            {children}
          </LiquidMetalVisual>
          <a
            href={href}
            className="liquid-metal-button__trigger"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabel ? ariaLabelledBy : labelId}
            onMouseEnter={(event) => {
              interaction.enter();
              onMouseEnter?.(event);
            }}
            onMouseLeave={(event) => {
              interaction.leave();
              onMouseLeave?.(event);
            }}
            onMouseDown={(event) => {
              interaction.press();
              onMouseDown?.(event);
            }}
            onMouseUp={(event) => {
              interaction.release();
              onMouseUp?.(event);
            }}
            onBlur={(event) => {
              interaction.release();
              onBlur?.(event);
            }}
            onClick={(event) => {
              interaction.click(event);
              onClick?.(event);
            }}
            {...props}
          >
            <RippleLayer ripples={interaction.ripples} />
          </a>
        </div>
      </div>
    </div>
  );
}

export { LiquidMetalButton, LiquidMetalLink };
