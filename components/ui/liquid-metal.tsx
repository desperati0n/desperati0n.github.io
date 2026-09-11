'use client';

import { useEffect, useRef } from 'react';

const vertexShader = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentShader = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    amplitude *= 0.5;
  }
  return value;
}

vec3 palette(float x) {
  vec3 c0 = vec3(0.035294, 0.035294, 0.043137);
  vec3 c1 = vec3(0.321569, 0.321569, 0.356863);
  vec3 c2 = vec3(0.831373, 0.831373, 0.847059);
  vec3 c3 = vec3(1.0);
  float f = clamp(x, 0.0, 1.0) * 3.0;
  vec3 color = mix(c0, c1, smoothstep(0.0, 1.0, clamp(f, 0.0, 1.0)));
  color = mix(color, c2, smoothstep(0.0, 1.0, clamp(f - 1.0, 0.0, 1.0)));
  color = mix(color, c3, smoothstep(0.0, 1.0, clamp(f - 2.0, 0.0, 1.0)));
  return color;
}

vec3 shade(vec2 p, float t) {
  const float intensity = 0.35;
  const float parameter = 0.28;
  float angle = atan(p.y, p.x);
  float radius = length(p);
  float shapeMode = floor(parameter * 3.99);
  float shape = mix(radius, abs(p.x) + abs(p.y), step(0.5, shapeMode));
  float daisy = radius - (0.08 + intensity * 0.05) * cos(angle * 8.0);
  shape = mix(shape, daisy, step(1.5, shapeMode));
  float fieldNoise = fbm(p * 3.0 + vec2(t * 0.12, -t * 0.08) + 1.0);
  float contour = shape + (fieldNoise - 0.5) * intensity * 0.24;
  float mask = 1.0 - smoothstep(0.48, 0.58, contour);
  float repetition = 3.0 + parameter * 17.0;
  float bands = 0.5 + 0.5 * sin((p.x * 0.7 + p.y * 0.3 + fieldNoise * 0.7) * repetition - t);
  float shine = pow(bands, mix(7.0, 1.5, intensity));
  vec3 metal = palette(clamp(bands * 0.6 + shine * 0.7, 0.0, 1.0));
  float rim = exp(-abs(contour - 0.53) * 35.0);
  return mix(vec3(0.035294, 0.035294, 0.043137) * 0.3, metal + rim * 0.35, mask);
}

void main() {
  vec2 screenUv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / min(u_resolution.x, u_resolution.y);
  p *= 1.26;
  vec3 color = shade(p, u_time);
  color = (color - 0.5) * 1.005 + 0.5;
  color += (grainHash(gl_FragCoord.xy + vec2(17.0, 31.0)) - 0.5) * 0.042;
  float edge = smoothstep(1.0, 0.34, length(screenUv - 0.5));
  color *= mix(0.72, 1.0, edge);
  gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
}`;

const contextLossTimers = new WeakMap<HTMLCanvasElement, number>();

function compileShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create WebGL shader');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? 'WebGL shader compilation failed';
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

export function ShaderBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pending = contextLossTimers.get(canvas);
    if (pending !== undefined) window.clearTimeout(pending);
    contextLossTimers.delete(canvas);

    const gl = canvas.getContext('webgl', { antialias: false });
    if (!gl) return;

    const program = gl.createProgram();
    if (!program) return;
    const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.deleteShader(vertex);
    gl.deleteShader(fragment);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const resolution = gl.getUniformLocation(program, 'u_resolution');
    const time = gl.getUniformLocation(program, 'u_time');
    const startedAt = performance.now();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let bounds = canvas.getBoundingClientRect();
    let frame = 0;
    let visible = document.visibilityState === 'visible';
    let intersecting = true;
    let destroyed = false;

    const resize = () => {
      bounds = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const rawWidth = Math.max(1, Math.round(bounds.width * ratio));
      const rawHeight = Math.max(1, Math.round(bounds.height * ratio));
      const scale = Math.min(1, Math.sqrt(2_000_000 / Math.max(1, rawWidth * rawHeight)));
      const width = Math.max(1, Math.round(rawWidth * scale));
      const height = Math.max(1, Math.round(rawHeight * scale));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const requestRender = () => {
      if (!destroyed && visible && intersecting && frame === 0) frame = requestAnimationFrame(render);
    };

    function render(now: number) {
      frame = 0;
      if (destroyed || !visible || !intersecting) return;
      resize();
      gl.uniform2f(resolution, canvas.width, canvas.height);
      gl.uniform1f(time, reducedMotion ? 0 : ((now - startedAt) / 1000) * 0.575);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!reducedMotion) requestRender();
    }

    const resizeObserver = new ResizeObserver(() => {
      resize();
      requestRender();
    });
    resizeObserver.observe(canvas);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry?.isIntersecting ?? true;
      if (intersecting) requestRender();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    });
    intersectionObserver.observe(canvas);
    const onVisibility = () => {
      visible = document.visibilityState === 'visible';
      if (visible) requestRender();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    };
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVisibility);
    requestRender();

    return () => {
      destroyed = true;
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      const timer = window.setTimeout(() => {
        if (contextLossTimers.get(canvas) === timer) {
          contextLossTimers.delete(canvas);
          gl.getExtension('WEBGL_lose_context')?.loseContext();
          canvas.width = 1;
          canvas.height = 1;
        }
      }, 0);
      contextLossTimers.set(canvas, timer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} style={{ display: 'block', width: '100%', height: '100%' }} />;
}
