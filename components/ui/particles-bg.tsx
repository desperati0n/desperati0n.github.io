'use client';

import { useCallback, useEffect } from 'react';

type ParticlesBackgroundProps = {
  className?: string;
};

declare global {
  interface Window {
    particlesJS?: (id: string, config: Record<string, unknown>) => void;
    pJSDom?: Array<{
      pJS: {
        fn: {
          vendors: {
            destroypJS: () => void;
          };
        };
      };
    }>;
  }
}

const containerId = 'particles-bg';

export default function ParticlesBackground({ className = '' }: ParticlesBackgroundProps) {
  const destroyParticles = useCallback(() => {
    document.querySelector(`#${containerId} canvas`)?.remove();
    window.pJSDom?.forEach((instance) => instance.pJS.fn.vendors.destroypJS());
    window.pJSDom = [];
  }, []);

  const initializeParticles = useCallback(() => {
    if (!window.particlesJS) return;

    destroyParticles();
    window.particlesJS(containerId, {
      particles: {
        number: { value: 180, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle', stroke: { width: 0.5, color: '#ffffff' } },
        opacity: { value: 0.48, random: true, anim: { enable: true, speed: 0.7, opacity_min: 0.12 } },
        size: { value: 2.4, random: true, anim: { enable: true, speed: 1.1, size_min: 0.7 } },
        line_linked: { enable: true, distance: 220, color: '#ffffff', opacity: 0.16, width: 0.8 },
        move: { enable: true, speed: 0.8, random: true, out_mode: 'bounce' },
      },
      interactivity: {
        detect_on: 'window',
        events: {
          onhover: { enable: true, mode: 'grab' },
          onclick: { enable: false, mode: 'push' },
          resize: true,
        },
        modes: {
          grab: { distance: 240, line_linked: { opacity: 0.52 } },
          repulse: { distance: 180, duration: 0.4 },
        },
      },
      retina_detect: true,
    });
  }, [destroyParticles]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.particlesJS) {
      initializeParticles();
      return destroyParticles;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
    script.async = true;
    script.dataset.particlesBg = 'true';
    script.addEventListener('load', initializeParticles);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener('load', initializeParticles);
      script.remove();
      destroyParticles();
    };
  }, [destroyParticles, initializeParticles]);

  return <div id={containerId} aria-hidden="true" className={`bg-black ${className}`} />;
}
