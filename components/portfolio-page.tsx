'use client';

import { useGSAP } from '@gsap/react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Binary,
  Braces,
  Code2,
  Cpu,
  Home,
  Layers3,
  Mail,
  Network,
  Radio,
  Terminal,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const navItems = [
  { name: '首页', href: '#home', icon: Home },
  { name: '关于', href: '#about', icon: UserRound },
  { name: '项目', href: '#projects', icon: Layers3 },
  { name: '联系', href: '#contact', icon: Mail },
];

const skills = [
  'TypeScript',
  'React',
  'Next.js',
  'Python',
  'PyTorch',
  'Node.js',
  'PostgreSQL',
  'Docker',
  'Git',
  'GSAP',
];

const projects = [
  {
    title: 'Neural Canvas',
    description: '把自然语言转化为可编辑节点图的生成式 AI 工作台，支持实时协作与版本回溯。',
    stack: ['React', 'FastAPI', 'WebSocket'],
    metric: '98ms',
    metricLabel: '交互延迟',
    image: 'https://picsum.photos/seed/neural-interface/1400/900',
    span: 'md:col-span-7',
    icon: Network,
  },
  {
    title: 'Tiny Compiler',
    description: '从词法分析到 WebAssembly 输出的教学编译器，附带可视化 AST 调试器。',
    stack: ['Rust', 'WASM', 'AST'],
    metric: '14k',
    metricLabel: '行测试代码',
    span: 'md:col-span-5',
    icon: Binary,
  },
  {
    title: 'Signal Lab',
    description: '面向校园实验室的边缘设备监测系统，统一采集、异常检测与告警链路。',
    stack: ['Python', 'MQTT', 'Docker'],
    metric: '32',
    metricLabel: '在线设备',
    span: 'md:col-span-5',
    icon: Radio,
  },
  {
    title: 'Distributed Notes',
    description: '离线优先的知识库实验，探索 CRDT、端到端加密与多端无冲突同步。',
    stack: ['CRDT', 'IndexedDB', 'P2P'],
    metric: '0',
    metricLabel: '同步冲突',
    image: 'https://picsum.photos/seed/distributed-system/1400/900',
    span: 'md:col-span-7',
    icon: Braces,
  },
];

const experiences = [
  {
    range: '2025 — 现在',
    title: 'HCI LAB',
    role: '前端研发实习生',
    copy: '参与多模态交互原型研发，将研究算法转化为可被真实用户验证的产品界面。',
    tags: ['React', 'WebGL', 'Research'],
  },
  {
    range: '2024 — 2025',
    title: 'CAMPUS OSS',
    role: '开源项目维护者',
    copy: '维护校园服务开源工具，重构核心状态层并建立自动化测试与发布流程。',
    tags: ['TypeScript', 'CI/CD', 'Testing'],
  },
  {
    range: '2023 — 2024',
    title: 'ACM STUDIO',
    role: '学生开发者',
    copy: '为程序设计训练平台开发实时判题状态与数据可视化，服务校内训练队。',
    tags: ['Algorithms', 'Node.js', 'PostgreSQL'],
  },
];

const principles = [
  {
    index: 'A',
    title: '清晰优于炫技',
    text: '真正好的工程会把复杂度留在内部，把清晰、快速且可预期的体验交给使用者。',
    detail: 'CLARITY / SYSTEMS THINKING',
  },
  {
    index: 'B',
    title: '速度来自结构',
    text: '我重视组件边界、类型约束与反馈回路。它们让快速迭代不再以技术债为代价。',
    detail: 'ARCHITECTURE / ITERATION',
  },
  {
    index: 'C',
    title: '好奇心驱动工程',
    text: '从编译器到生成式 AI，我享受拆开黑盒、理解原理，再把知识做成真实产品。',
    detail: 'CURIOSITY / CRAFT',
  },
];

function TubeLightNav() {
  const [active, setActive] = useState('首页');

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 110, damping: 18, delay: 0.3 }}
      className="fixed left-1/2 top-5 z-50 -translate-x-1/2"
      aria-label="主导航"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/70 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = active === item.name;
          return (
            <a
              key={item.name}
              href={item.href}
              onClick={() => setActive(item.name)}
              className="group relative flex h-10 items-center gap-2 rounded-full px-3 text-sm text-white/55 transition-colors duration-300 hover:text-white"
            >
              {selected && (
                <motion.span layoutId="nav-light" className="absolute inset-0 -z-10 rounded-full bg-white/10">
                  <span className="absolute -top-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_14px_3px_rgba(103,232,249,.7)]" />
                </motion.span>
              )}
              <Icon className="h-4 w-4" strokeWidth={1.7} />
              <span className="hidden sm:inline">{item.name}</span>
            </a>
          );
        })}
      </div>
    </motion.nav>
  );
}

function CursorField() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const smoothX = useSpring(x, { stiffness: 90, damping: 22, mass: 0.5 });
  const smoothY = useSpring(y, { stiffness: 90, damping: 22, mass: 0.5 });
  const rotateX = useTransform(smoothY, [-400, 400], [9, -9]);
  const rotateY = useTransform(smoothX, [-700, 700], [-11, 11]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      x.set(event.clientX - window.innerWidth / 2);
      y.set(event.clientY - window.innerHeight / 2);
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [x, y]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className="hero-machine absolute inset-x-[6%] bottom-[-18%] top-[42%]"
    >
      <div className="absolute inset-0 rounded-[50%] border border-white/10 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,.14),transparent_42%)] shadow-[inset_0_1px_0_rgba(255,255,255,.13),0_-30px_100px_rgba(34,211,238,.08)]" />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 24, ease: 'linear', repeat: Infinity }}
        className="absolute left-1/2 top-[12%] h-40 w-40 -translate-x-1/2 rounded-full border border-dashed border-cyan-200/30 sm:h-56 sm:w-56"
      >
        <div className="absolute left-1/2 top-[-6px] h-3 w-3 -translate-x-1/2 rounded-full bg-cyan-200 shadow-[0_0_28px_8px_rgba(103,232,249,.55)]" />
      </motion.div>
      <div className="absolute left-1/2 top-[21%] grid h-24 w-24 -translate-x-1/2 place-items-center rounded-3xl border border-white/15 bg-black/70 shadow-2xl backdrop-blur-md sm:h-32 sm:w-32">
        <Code2 className="h-10 w-10 text-white sm:h-14 sm:w-14" strokeWidth={1.1} />
      </div>
    </motion.div>
  );
}

function MagneticLink({ href, children, primary = false }: { href: string; children: ReactNode; primary?: boolean }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18 });
  const springY = useSpring(y, { stiffness: 260, damping: 18 });

  function move(event: ReactPointerEvent<HTMLAnchorElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - box.left - box.width / 2) * 0.24);
    y.set((event.clientY - box.top - box.height / 2) * 0.24);
  }

  return (
    <motion.a
      href={href}
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x: springX, y: springY }}
      className={
        primary
          ? 'group flex items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black'
          : 'flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10'
      }
    >
      {children}
    </motion.a>
  );
}

function SkillMarquee() {
  const row = [...skills, ...skills];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-5 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="marquee-track flex w-max items-center">
        {row.map((skill, index) => (
          <div key={`${skill}-${index}`} className="flex items-center gap-7 pr-7 font-mono text-sm tracking-[0.16em] text-white/48">
            <span>{skill.toUpperCase()}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-200/75 shadow-[0_0_12px_rgba(103,232,249,.7)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function StorySection() {
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const words = '我相信代码不只需要正确运行，也应该让人感到自然。我在计算机科学的严谨与设计的感知之间工作，把复杂系统拆成清晰、可靠、值得信任的体验。'.split('');

  useGSAP(
    () => {
      const letters = gsap.utils.toArray<HTMLElement>('[data-reveal-letter]');
      gsap.fromTo(
        letters,
        { opacity: 0.1 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: {
            trigger: root.current,
            start: 'top 65%',
            end: 'bottom 72%',
            scrub: 1,
          },
        },
      );

      const media = gsap.matchMedia();
      media.add('(min-width: 768px)', () => {
        ScrollTrigger.create({
          trigger: root.current,
          start: 'top 18%',
          end: 'bottom 72%',
          pin: title.current,
          pinSpacing: false,
        });
      });
      return () => media.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="about" className="relative mx-auto grid min-h-[145vh] max-w-7xl gap-16 px-5 py-32 md:grid-cols-[0.8fr_1.7fr] md:px-10 md:py-48">
      <div ref={title} className="h-fit">
        <p className="font-mono text-sm tracking-[0.18em] text-cyan-200/70">WHO I AM</p>
        <h2 className="mt-5 max-w-sm text-4xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-6xl">
          逻辑之外，
          <span className="text-white/30">仍然是人。</span>
        </h2>
      </div>
      <div className="flex flex-col justify-between gap-24 md:pt-[16vh]">
        <p className="max-w-4xl text-[clamp(2rem,4.5vw,4.6rem)] font-medium leading-[1.04] tracking-[-0.045em]">
          {words.map((letter, index) => (
            <span key={`${letter}-${index}`} data-reveal-letter className="will-change-opacity">
              {letter}
            </span>
          ))}
        </p>
        <div className="grid max-w-3xl gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {[
            ['CS', '主修方向', '计算机科学'],
            ['2026', '预计毕业', '本科'],
            ['OPEN', '当前状态', '寻找实习'],
          ].map(([value, label, note]) => (
            <div key={label} className="bg-black p-7">
              <p className="text-3xl font-medium tracking-tight">{value}</p>
              <p className="mt-7 text-sm text-white/40">{label}</p>
              <p className="mt-1 text-sm text-white/75">{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhysicsCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7, 7]), { stiffness: 180, damping: 24 });
  const glowX = useTransform(x, [-0.5, 0.5], ['15%', '85%']);
  const glowY = useTransform(y, [-0.5, 0.5], ['15%', '85%']);
  const Icon = project.icon;

  function move(event: ReactPointerEvent<HTMLElement>) {
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - box.left) / box.width - 0.5);
    y.set((event.clientY - box.top) / box.height - 0.5);
  }

  return (
    <motion.article
      onPointerMove={move}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={`project-card group relative min-h-[380px] overflow-hidden bg-[#08090a] p-7 sm:p-9 ${project.span}`}
    >
      {project.image && (
        <img
          src={project.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25 grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      <motion.div
        aria-hidden="true"
        style={{ left: glowX, top: glowY }}
        className="pointer-events-none absolute h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-200/[0.065] blur-3xl"
      />
      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-black/40 backdrop-blur">
            <Icon className="h-5 w-5 text-cyan-100" strokeWidth={1.4} />
          </span>
          <span className="font-mono text-xs text-white/30">0{index + 1}</span>
        </div>
        <div className="mt-auto max-w-2xl pt-20">
          <div className="mb-7 flex items-end justify-between gap-6">
            <h3 className="text-3xl font-medium tracking-[-0.04em] sm:text-5xl">{project.title}</h3>
            <div className="hidden text-right sm:block">
              <p className="text-2xl font-medium">{project.metric}</p>
              <p className="text-xs text-white/35">{project.metricLabel}</p>
            </div>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-white/52">{project.description}</p>
          <div className="mt-7 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-xs text-white/55">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function ProjectsSection() {
  return (
    <section id="projects" className="chapter mx-auto max-w-7xl px-5 py-32 md:px-10 md:py-48">
      <div className="mb-16 flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-sm tracking-[0.18em] text-cyan-200/70">SELECTED WORK</p>
          <h2 className="mt-5 max-w-3xl text-5xl font-medium leading-[0.93] tracking-[-0.055em] sm:text-7xl">把问题做成可以被使用的答案。</h2>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-white/42">选择卡片并移动鼠标，查看弹簧阻尼与空间高光如何响应。</p>
      </div>
      <div className="grid grid-flow-dense grid-cols-1 gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-12 md:grid-rows-2">
        {projects.map((project, index) => (
          <PhysicsCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </section>
  );
}

function ExperienceAccordion() {
  const [active, setActive] = useState(0);

  return (
    <section className="chapter mx-auto max-w-7xl px-5 py-32 md:px-10 md:py-48">
      <div className="mb-16 max-w-4xl">
        <p className="font-mono text-sm tracking-[0.18em] text-cyan-200/70">EXPERIENCE</p>
        <h2 className="mt-5 text-5xl font-medium leading-[0.95] tracking-[-0.055em] sm:text-7xl">经验不是时间线，是不断扩大的问题边界。</h2>
      </div>
      <div className="flex min-h-[640px] flex-col gap-2 md:min-h-[520px] md:flex-row">
        {experiences.map((item, index) => {
          const selected = active === index;
          return (
            <button
              key={item.title}
              type="button"
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              className={`experience-panel group relative overflow-hidden rounded-[1.75rem] border border-white/10 p-7 text-left transition-[flex] duration-700 ease-[cubic-bezier(.2,.8,.2,1)] md:p-9 ${selected ? 'flex-[3.6]' : 'flex-1'}`}
              aria-expanded={selected}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_0%,rgba(103,232,249,.09),transparent_38%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
              <div className="relative flex h-full min-h-[150px] flex-col">
                <div className="flex items-start justify-between gap-6">
                  <p className="font-mono text-xs tracking-[0.12em] text-white/36">{item.range}</p>
                  <ArrowDownRight className={`h-5 w-5 text-cyan-100 transition-transform duration-500 ${selected ? 'rotate-45' : ''}`} />
                </div>
                <div className="mt-auto pt-16">
                  <h3 className="text-3xl font-medium tracking-[-0.04em] sm:text-4xl">{item.title}</h3>
                  <p className="mt-2 text-sm text-cyan-100/65">{item.role}</p>
                  <AnimatePresence initial={false}>
                    {selected && (
                      <motion.div
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.42, delay: 0.12 }}
                      >
                        <p className="mt-7 max-w-lg text-base leading-relaxed text-white/50">{item.copy}</p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {item.tags.map((tag) => (
                            <span key={tag} className="rounded-full border border-white/10 px-3 py-1 font-mono text-xs text-white/45">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function PrinciplesCarousel() {
  const [current, setCurrent] = useState(0);
  const item = principles[current];

  function step(direction: number) {
    setCurrent((value) => (value + direction + principles.length) % principles.length);
  }

  return (
    <section className="chapter relative overflow-hidden py-32 md:py-48">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(103,232,249,.06),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 md:grid-cols-[0.8fr_1.6fr] md:px-10">
        <div>
          <p className="font-mono text-sm tracking-[0.18em] text-cyan-200/70">HOW I WORK</p>
          <p className="mt-5 max-w-xs text-base leading-relaxed text-white/43">驱动我做出判断的三条工程原则。</p>
          <div className="mt-10 flex gap-3">
            <button type="button" onClick={() => step(-1)} aria-label="上一条" className="grid h-12 w-12 place-items-center rounded-full border border-white/12 text-white/65 transition-colors hover:bg-white hover:text-black">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="下一条" className="grid h-12 w-12 place-items-center rounded-full border border-white/12 text-white/65 transition-colors hover:bg-white hover:text-black">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="min-h-[360px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 55, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -35, filter: 'blur(8px)' }}
              transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <span className="font-mono text-sm text-white/25">{item.index} / C</span>
              <h2 className="mt-8 text-[clamp(3.4rem,7.5vw,7.6rem)] font-medium leading-[0.88] tracking-[-0.065em]">{item.title}</h2>
              <p className="mt-9 max-w-2xl text-lg leading-relaxed text-white/52 sm:text-xl">{item.text}</p>
              <p className="mt-9 font-mono text-xs tracking-[0.14em] text-cyan-200/55">{item.detail}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function MotionFooter() {
  return (
    <footer id="contact" className="relative min-h-screen overflow-hidden border-t border-white/10 bg-[#050606] px-5 pb-8 pt-32 md:px-10 md:pt-48">
      <div className="footer-orbit absolute left-1/2 top-1/2 h-[65vw] w-[65vw] min-h-[620px] min-w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
      <div className="absolute left-1/2 top-1/2 h-[42vw] w-[42vw] min-h-[400px] min-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-cyan-200/[0.08]" />
      <div className="relative mx-auto flex min-h-[calc(100vh-13rem)] max-w-7xl flex-col">
        <div className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center text-center">
          <p className="font-mono text-sm tracking-[0.18em] text-cyan-200/70">AVAILABLE FOR INTERNSHIPS</p>
          <h2 className="mt-7 text-[clamp(4.4rem,13vw,13rem)] font-medium leading-[0.76] tracking-[-0.075em]">
            LET&apos;S
            <span className="block text-white/24">BUILD.</span>
          </h2>
          <motion.a
            whileHover={{ scale: 1.045 }}
            whileTap={{ scale: 0.97 }}
            href="mailto:hello@linshu.dev"
            className="group mt-12 flex items-center gap-4 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black"
          >
            hello@linshu.dev
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.a>
        </div>
        <div className="flex flex-col gap-6 border-t border-white/10 pt-7 text-sm text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <p>林述 / 计算机科学学生</p>
          <div className="flex gap-5">
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-white">
              <Code2 className="h-4 w-4" /> GitHub
            </a>
            <a href="#home" className="transition-colors hover:text-white">回到顶部</a>
          </div>
          <p>© 2026</p>
        </div>
      </div>
    </footer>
  );
}

export function PortfolioPage() {
  const main = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>('.chapter').forEach((chapter) => {
        gsap.fromTo(
          chapter.querySelectorAll(':scope > *'),
          { y: 70, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: chapter, start: 'top 78%', once: true },
          },
        );
      });
    },
    { scope: main },
  );

  return (
    <main ref={main} className="w-full max-w-full overflow-x-hidden bg-black text-white">
      <TubeLightNav />
      <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 pb-24 pt-32 sm:px-10">
        <div className="ambient-grid absolute inset-0" />
        <div className="absolute left-1/2 top-1/4 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-cyan-400/[0.055] blur-[110px]" />
        <CursorField />

        <div className="relative z-10 mx-auto flex w-full max-w-6xl -translate-y-16 flex-col items-center text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="mb-7 font-mono text-sm tracking-[0.22em] text-cyan-200/80">
            CS STUDENT / CREATIVE DEVELOPER
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1, delay: 0.2, ease: [0.2, 0.8, 0.2, 1] }}
            className="w-full max-w-6xl text-balance text-[clamp(3.35rem,8.4vw,8rem)] font-medium leading-[0.88] tracking-[-0.065em]"
          >
            构建有思想的代码
            <span className="block text-white/35">与有温度的体验。</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }} className="mt-8 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">
            我是林述，一名计算机科学学生，关注人机交互、Web 工程与生成式 AI。
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-9 flex flex-col gap-3 sm:flex-row">
            <MagneticLink href="#projects" primary>
              查看项目
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </MagneticLink>
            <MagneticLink href="#contact">与我联系</MagneticLink>
          </motion.div>
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-white/30">
          <span className="h-px w-9 bg-white/20" /> SCROLL TO EXPLORE <span className="h-px w-9 bg-white/20" />
        </div>
      </section>
      <SkillMarquee />
      <StorySection />
      <ProjectsSection />
      <ExperienceAccordion />
      <PrinciplesCarousel />
      <MotionFooter />
    </main>
  );
}
