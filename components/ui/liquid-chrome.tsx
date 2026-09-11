'use client';

import { Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef, type HTMLAttributes } from 'react';

import { cn } from '@/lib/utils';

interface LiquidChromeProps extends HTMLAttributes<HTMLDivElement> {
  baseColor?: [number, number, number];
  speed?: number;
  amplitude?: number;
  frequencyX?: number;
  frequencyY?: number;
  interactive?: boolean;
}

const vertexShader = /* glsl */ `
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec3 uResolution;
  uniform vec3 uBaseColor;
  uniform float uAmplitude;
  uniform float uFrequencyX;
  uniform float uFrequencyY;
  uniform vec2 uMouse;
  varying vec2 vUv;

  vec4 renderImage(vec2 uvCoord) {
    vec2 fragCoord = uvCoord * uResolution.xy;
    vec2 uv = (2.0 * fragCoord - uResolution.xy) / min(uResolution.x, uResolution.y);

    for (float i = 1.0; i < 10.0; i++) {
      uv.x += uAmplitude / i * cos(i * uFrequencyX * uv.y + uTime + uMouse.x * 3.14159);
      uv.y += uAmplitude / i * cos(i * uFrequencyY * uv.x + uTime + uMouse.y * 3.14159);
    }

    vec2 diff = uvCoord - uMouse;
    float dist = length(diff);
    float falloff = exp(-dist * 20.0);
    float ripple = sin(10.0 * dist - uTime * 2.0) * 0.03;
    uv += (diff / (dist + 0.0001)) * ripple * falloff;

    vec3 color = uBaseColor / abs(sin(uTime - uv.y - uv.x));
    return vec4(color, 1.0);
  }

  void main() {
    vec4 color = vec4(0.0);
    int samples = 0;

    for (int i = -1; i <= 1; i++) {
      for (int j = -1; j <= 1; j++) {
        vec2 offset = vec2(float(i), float(j)) * (1.0 / min(uResolution.x, uResolution.y));
        color += renderImage(vUv + offset);
        samples++;
      }
    }

    gl_FragColor = color / float(samples);
  }
`;

export default function LiquidChrome({
  baseColor = [0.04, 0.04, 0.04],
  speed = 2,
  amplitude = 0.1,
  frequencyX = 3,
  frequencyY = 2,
  interactive = false,
  className,
  ...props
}: LiquidChromeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [baseRed, baseGreen, baseBlue] = baseColor;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let renderer: Renderer | null = null;
    let program: Program | null = null;
    let mesh: Mesh | null = null;
    let animationId = 0;
    let resizeObserver: ResizeObserver | null = null;

    const resize = () => {
      if (!renderer || !program) return;
      renderer.setSize(Math.max(1, container.offsetWidth), Math.max(1, container.offsetHeight));
      const resolution = program.uniforms.uResolution.value as Float32Array;
      resolution[0] = renderer.gl.canvas.width;
      resolution[1] = renderer.gl.canvas.height;
      resolution[2] = renderer.gl.canvas.width / renderer.gl.canvas.height;
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (!program) return;
      const rect = container.getBoundingClientRect();
      const mouse = program.uniforms.uMouse.value as Float32Array;
      mouse[0] = (event.clientX - rect.left) / rect.width;
      mouse[1] = 1 - (event.clientY - rect.top) / rect.height;
    };

    const destroy = () => {
      cancelAnimationFrame(animationId);
      resizeObserver?.disconnect();
      resizeObserver = null;
      if (interactive) container.removeEventListener('pointermove', handlePointerMove);
      const canvas = renderer?.gl.canvas;
      if (canvas?.parentElement === container) container.removeChild(canvas);
      renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext();
      renderer = null;
      program = null;
      mesh = null;
    };

    const mount = () => {
      if (renderer) return;
      renderer = new Renderer({
        antialias: true,
        alpha: true,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
      const gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      const geometry = new Triangle(gl);
      program = new Program(gl, {
        vertex: vertexShader,
        fragment: fragmentShader,
        uniforms: {
          uTime: { value: 0 },
          uResolution: { value: new Float32Array([1, 1, 1]) },
          uBaseColor: { value: new Float32Array([baseRed, baseGreen, baseBlue]) },
          uAmplitude: { value: amplitude },
          uFrequencyX: { value: frequencyX },
          uFrequencyY: { value: frequencyY },
          uMouse: { value: new Float32Array([0, 0]) },
        },
      });
      mesh = new Mesh(gl, { geometry, program });
      container.appendChild(gl.canvas);
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);
      resize();
      if (interactive) container.addEventListener('pointermove', handlePointerMove);

      const update = (time: number) => {
        if (!renderer || !program || !mesh) return;
        animationId = requestAnimationFrame(update);
        program.uniforms.uTime.value = time * 0.001 * speed;
        renderer.render({ scene: mesh });
      };
      animationId = requestAnimationFrame(update);
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) mount();
        else destroy();
      },
      { rootMargin: '240px' },
    );
    intersectionObserver.observe(container);

    return () => {
      intersectionObserver.disconnect();
      destroy();
    };
  }, [baseRed, baseGreen, baseBlue, speed, amplitude, frequencyX, frequencyY, interactive]);

  return <div ref={containerRef} className={cn('h-full w-full', className)} {...props} />;
}
