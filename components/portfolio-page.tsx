'use client';

import { useGSAP } from '@gsap/react';
import { DocumentLanguage } from '@/components/document-language';
import { ShaderBackground } from '@/components/ui/liquid-metal';
import ParticlesBackground from '@/components/ui/particles-bg';
import { ChromeLink } from '@/components/ui/chrome-button';
import { LiquidMetalButton, LiquidMetalLink } from '@/components/ui/liquid-metal-button';
import { GithubProfilePanel } from '@/components/ui/github-profile-panel';
import { InlineTextReveal } from '@/components/ui/text-reveal';
import { Dock, DockItem } from '@/components/ui/dock';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Award,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Home,
  Layers3,
  Mail,
  UserRound,
} from 'lucide-react';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export type PortfolioLocale = 'en' | 'zh';

const siteContent = {
  en: {
    nav: [
      { name: 'Home', href: '#home', icon: Home },
      { name: 'About', href: '#about', icon: UserRound },
      { name: 'Projects', href: '#projects', icon: Layers3 },
      { name: 'Contact', href: '#contact', icon: Mail },
    ],
    languageHref: '/zh',
    languageLabel: 'View in Chinese',
    languageShort: '中文',
    projects: [
      {
        title: 'bacterial-segmentation-benchmark',
        description: 'A unified evaluation of Cellpose-SAM, MicroSAM DeepBacs, and Omnipose, followed by deployment of the selected model as a callable GPU inference service.',
        href: '/projects#bacterial-segmentation',
        language: 'Python',
      },
      {
        title: 'ticket_service',
        description: 'An asynchronous IT ticketing pipeline built with FastAPI, Redis Streams, and multiple databases, with an eight-tool MCP service.',
        href: '/projects#ticket-service',
        language: 'Python',
      },
      {
        title: 'rag-agent-tutorial',
        description: 'An end-to-end RAG agent covering multi-format parsing, vector retrieval, reranking, and multi-turn tool calling.',
        href: '/projects#rag-agent',
        language: 'Python',
      },
    ],
    story: 'My main interest is artificial intelligence. I enjoy learning through hands-on projects and exploring how ideas can become useful systems.',
    aboutTitle: 'About',
    stats: [
      ['3.57', '/ 4.0', 'CGPA', ''],
      ['2028', '', 'Expected graduation', 'Computer Science undergraduate'],
      ['OPEN', '', 'Current status', 'Seeking AI / backend internships'],
    ],
    highlights: [
      {
        label: 'EDUCATION',
        period: 'SEP 2024 — JUL 2028 (EXPECTED)',
        title: 'Xiamen University',
        summary: 'Undergraduate Student in Computer Science and Technology, CGPA 3.57 / 4.00; IELTS 6.0.',
        icon: GraduationCap,
      },
      {
        label: 'INTERNSHIP',
        period: 'AUG — SEP 2026',
        title: 'Huiming Alpha Tech',
        summary: 'AI Engineering Intern in the R&D Department, working on computer vision evaluation and deployment, an IT ticketing agent, and an MCP platform.',
        icon: BriefcaseBusiness,
      },
      {
        label: 'HONOUR',
        period: 'SEP 2025 SEMESTER',
        title: "Dean's List Award",
        summary: 'School of Computing and Data Science, Xiamen University.',
        icon: Award,
      },
    ],
    skillsIntro: 'A practical stack spanning AI capabilities and backend infrastructure.',
    skills: [
      {
        index: 'A',
        title: 'Programming & Backend',
        text: 'I build server-side applications with Python, C/C++, and SQL, using FastAPI, Pydantic, SQLAlchemy, SSE, and REST APIs.',
        detail: 'PYTHON / C++ / FASTAPI / SQL',
      },
      {
        index: 'B',
        title: 'AI Applications',
        text: 'I develop practical AI applications around RAG, embeddings, reranking, LangChain, tool calling, and MCP.',
        detail: 'RAG / LANGCHAIN / TOOL CALLING / MCP',
      },
      {
        index: 'C',
        title: 'Data & Engineering',
        text: 'I work with MySQL, MongoDB, Redis Streams, and ChromaDB, and package projects with Docker Compose, Git/GitHub, and Linux.',
        detail: 'MYSQL / REDIS / DOCKER / LINUX',
      },
    ],
    previous: 'Previous skill',
    next: 'Next skill',
    heroTitle: 'Welcome to my portfolio.',
    heroBody: 'I’m Qian Cheng, a Computer Science undergraduate.',
    projectsCta: 'View projects',
    footerKicker: 'OPEN TO AI & BACKEND INTERNSHIPS',
    backToTop: 'Back to top',
  },
  zh: {
    nav: [
      { name: '首页', href: '#home', icon: Home },
      { name: '关于', href: '#about', icon: UserRound },
      { name: '项目', href: '#projects', icon: Layers3 },
      { name: '联系', href: '#contact', icon: Mail },
    ],
    languageHref: '/',
    languageLabel: 'View in English',
    languageShort: 'EN',
    projects: [
      {
        title: 'bacterial-segmentation-benchmark',
        description: '统一评测 Cellpose-SAM、MicroSAM DeepBacs 与 Omnipose，并将优选模型封装为可调用的 GPU 推理服务。',
        href: '/zh/projects#bacterial-segmentation',
        language: 'Python',
      },
      {
        title: 'ticket_service',
        description: '基于 FastAPI、Redis Streams 与多数据库构建异步 IT 工单链路，并重构为 8 工具 MCP 服务。',
        href: '/zh/projects#ticket-service',
        language: 'Python',
      },
      {
        title: 'rag-agent-tutorial',
        description: '覆盖多格式文档解析、向量召回、Reranker 精排与多轮 Tool Calling 的完整 RAG Agent 链路。',
        href: '/zh/projects#rag-agent',
        language: 'Python',
      },
    ],
    story: '我对人工智能很感兴趣，希望未来继续在 AI 方向发展。平时主要通过课程、开源项目和实际开发学习，最近在做 RAG、Agent、MCP 和计算机视觉相关项目。',
    aboutTitle: '关于我',
    stats: [
      ['3.57', '/ 4.0', 'CGPA', ''],
      ['2028', '', '预计毕业', '计算机科学本科'],
      ['OPEN', '', '当前状态', '寻找 AI / 后端实习'],
    ],
    highlights: [
      {
        label: '教育',
        period: '2024.09 — 2028.07（预计）',
        title: '厦门大学',
        summary: '计算机科学与技术本科，CGPA 3.57 / 4.0；IELTS 6.0。',
        icon: GraduationCap,
      },
      {
        label: '实习',
        period: '2026.08 — 2026.09',
        title: '深圳市慧明信息科技有限公司',
        summary: '研发部 AI 开发工程师，参与计算机视觉评测部署、工单 Agent 与 MCP 平台建设。',
        icon: BriefcaseBusiness,
      },
      {
        label: '荣誉',
        period: '2025/09 SEMESTER',
        title: "Dean's List Award",
        summary: '厦门大学 School of Computing and Data Science。',
        icon: Award,
      },
    ],
    skillsIntro: '从 AI 能力到后端基础设施的技术栈。',
    skills: [
      {
        index: 'A',
        title: '编程与后端',
        text: '使用 Python、C/C++ 与 SQL 开发服务端应用，熟悉 FastAPI、Pydantic、SQLAlchemy、SSE 与 REST API。',
        detail: 'PYTHON / C++ / FASTAPI / SQL',
      },
      {
        index: 'B',
        title: 'AI 应用',
        text: '围绕 RAG、Embedding、Reranker、LangChain、Tool Calling 与 MCP 构建可落地的智能应用。',
        detail: 'RAG / LANGCHAIN / TOOL CALLING / MCP',
      },
      {
        index: 'C',
        title: '数据与工程',
        text: '具备 MySQL、MongoDB、Redis Streams 与 ChromaDB 使用经验，并通过 Docker Compose、Git/GitHub 与 Linux 完成交付。',
        detail: 'MYSQL / REDIS / DOCKER / LINUX',
      },
    ],
    previous: '上一条',
    next: '下一条',
    heroTitle: '你好，欢迎来到我的个人简介。',
    heroBody: '钱程，厦门大学计算机科学本科生。关注 AI Agent、RAG、MCP 与可靠后端系统。',
    projectsCta: '查看项目',
    footerKicker: 'OPEN TO AI & BACKEND INTERNSHIPS',
    backToTop: '回到顶部',
  },
};

function PortfolioDock({ locale }: { locale: PortfolioLocale }) {
  const content = siteContent[locale];
  const navItems = content.nav;
  const [activeHref, setActiveHref] = useState(navItems[0].href);

  useEffect(() => {
    let frameId: number | null = null;

    const updateActiveItem = () => {
      frameId = null;
      const viewportMarker = window.innerHeight * 0.35;
      let nextActiveHref = navItems[0].href;

      navItems.forEach((item) => {
        if (!item.href.startsWith('#')) return;
        const section = document.querySelector<HTMLElement>(item.href);
        if (section && section.getBoundingClientRect().top <= viewportMarker) {
          nextActiveHref = item.href;
        }
      });

      setActiveHref((current) => (current === nextActiveHref ? current : nextActiveHref));
    };

    const scheduleUpdate = () => {
      if (frameId === null) {
        frameId = window.requestAnimationFrame(updateActiveItem);
      }
    };

    updateActiveItem();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frameId !== null) window.cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 110, damping: 18, delay: 0.3 }}
      className="fixed left-1/2 top-5 z-50 -translate-x-1/2"
      aria-label={locale === 'en' ? 'Primary navigation' : '主导航'}
    >
      <Dock>
        {navItems.map((item) => {
          const Icon = item.icon;
          const selected = activeHref === item.href;
          return (
            <DockItem key={item.name} active={selected} label={item.name}>
              <a
                href={item.href}
                aria-label={item.name}
                aria-current={selected ? 'page' : undefined}
                className={`flex size-full items-center justify-center rounded-full outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/65 ${selected ? 'text-white' : 'text-white/55'}`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.7} />
              </a>
            </DockItem>
          );
        })}
        <span
          aria-hidden="true"
          className="h-6 w-px shrink-0 self-center bg-white/20"
        />
        <DockItem label={content.languageLabel}>
          <a
            href={content.languageHref}
            aria-label={content.languageLabel}
            className="flex size-full items-center justify-center rounded-full text-[11px] font-semibold tracking-wide text-white/70 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-white/65"
          >
            {content.languageShort}
          </a>
        </DockItem>
      </Dock>
    </motion.nav>
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
    <motion.div style={{ x: springX, y: springY }} className="inline-block">
      <ChromeLink
        href={href}
        onPointerMove={move}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
        className={primary ? 'group min-w-[168px]' : 'group'}
      >
        {children}
      </ChromeLink>
    </motion.div>
  );
}

function SectionFade() {
  return <div aria-hidden="true" className="relative z-20 -mt-px h-32 bg-gradient-to-b from-black via-black/85 to-transparent" />;
}

function StorySection({ locale }: { locale: PortfolioLocale }) {
  const content = siteContent[locale];
  const root = useRef<HTMLElement>(null);
  const title = useRef<HTMLDivElement>(null);
  const story = useRef<HTMLParagraphElement>(null);
  const words = locale === 'en' ? content.story.split(/(\s+)/) : content.story.split('');

  useGSAP(
    () => {
      const letters = gsap.utils.toArray<HTMLElement>('[data-reveal-letter]');
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: story.current,
          start: 'top 32%',
          end: () => `+=${window.innerHeight * 1.25}`,
          scrub: 0.7,
          pin: story.current,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      reveal
        .fromTo(
          letters,
          { opacity: 0.1 },
          {
            opacity: 0.1,
            duration: 0.14,
          },
        )
        .to(letters, {
          opacity: 1,
          duration: 0.28,
          stagger: { amount: 0.72, from: 'start' },
          ease: 'none',
        })
        .to(letters, { opacity: 1, duration: 0.14 });

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
        <p className="font-mono text-sm tracking-[0.18em] text-white/60">WHO I AM</p>
        <h2 className="mt-5 max-w-sm text-4xl font-medium leading-[0.95] tracking-[-0.05em] sm:text-6xl">{content.aboutTitle}</h2>
      </div>
      <div className="flex flex-col justify-between gap-24 md:pt-[16vh]">
        <p ref={story} className="max-w-4xl text-[clamp(2rem,4.5vw,4.6rem)] font-medium leading-[1.04] tracking-[-0.045em]">
          {words.map((letter, index) => (
            <span key={`${letter}-${index}`} data-reveal-letter className="will-change-opacity">
              {letter}
            </span>
          ))}
        </p>
        <div className="grid max-w-3xl gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {content.stats.map(([value, suffix, label, note]) => (
            <div key={label} className="bg-black p-7">
              <p className="text-3xl font-medium tracking-tight">
                {value}
                {suffix && <span className="text-base font-normal text-white/55">{suffix}</span>}
              </p>
              <p className="mt-7 text-sm text-white/40">{label}</p>
              {note && <p className="mt-1 text-sm text-white/75">{note}</p>}
            </div>
          ))}
        </div>
        <div className="grid max-w-4xl gap-4">
          {content.highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.label} className="group grid gap-6 rounded-3xl border border-white/10 bg-[#08090a]/82 p-6 transition-colors hover:border-white/20 sm:grid-cols-[10rem_1fr] sm:p-8">
                <div>
                  <div className="flex items-center gap-3 text-white/45">
                    <Icon className="size-5" strokeWidth={1.5} />
                    <span className="font-mono text-xs tracking-[0.16em]">{item.label}</span>
                  </div>
                  <p className="mt-4 font-mono text-xs leading-5 text-white/30">{item.period}</p>
                </div>
                <div>
                  <h3 className="text-2xl font-medium tracking-[-0.035em] sm:text-3xl">{item.title}</h3>
                  <p className="mt-3 max-w-2xl text-base leading-7 text-white/52">{item.summary}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection({ locale }: { locale: PortfolioLocale }) {
  const content = siteContent[locale];
  return (
    <section id="projects" className="chapter mx-auto max-w-7xl px-5 py-32 md:px-10 md:py-48">
      <GithubProfilePanel projects={content.projects} locale={locale} />
    </section>
  );
}

function SkillsCarousel({ locale }: { locale: PortfolioLocale }) {
  const content = siteContent[locale];
  const skillGroups = content.skills;
  const [current, setCurrent] = useState(0);
  const item = skillGroups[current];

  function step(direction: number) {
    setCurrent((value) => (value + direction + skillGroups.length) % skillGroups.length);
  }

  return (
    <section className="chapter relative overflow-hidden py-32 md:py-48">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,rgba(255,255,255,.05),transparent_32%)]" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 md:grid-cols-[0.8fr_1.6fr] md:px-10">
        <div>
          <p className="font-mono text-sm tracking-[0.18em] text-white/60">TECH STACK</p>
          <p className="mt-5 max-w-xs text-base leading-relaxed text-white/43">{content.skillsIntro}</p>
          <div className="mt-10 flex gap-3">
            <LiquidMetalButton type="button" onClick={() => step(-1)} aria-label={content.previous} variant="icon" size="icon" className="h-12 w-12 text-white/65">
              <ArrowLeft className="h-4 w-4" />
            </LiquidMetalButton>
            <LiquidMetalButton type="button" onClick={() => step(1)} aria-label={content.next} variant="icon" size="icon" className="h-12 w-12 text-white/65">
              <ArrowRight className="h-4 w-4" />
            </LiquidMetalButton>
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
              <h2 className="mt-8 text-[clamp(3rem,7vw,7.2rem)] font-medium leading-[0.88] tracking-[-0.06em]">{item.title}</h2>
              <p className="mt-9 max-w-2xl text-lg leading-relaxed text-white/52 sm:text-xl">{item.text}</p>
              <p className="mt-9 font-mono text-xs tracking-[0.14em] text-white/45">{item.detail}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function MotionFooter({ locale }: { locale: PortfolioLocale }) {
  const content = siteContent[locale];
  return (
    <footer id="contact" className="relative min-h-screen overflow-hidden bg-transparent px-5 pb-8 pt-32 md:px-10 md:pt-48">
      <div className="relative mx-auto flex min-h-[calc(100vh-13rem)] max-w-7xl flex-col">
        <div className="mx-auto flex max-w-6xl flex-1 flex-col items-center justify-center text-center">
          <p className="font-mono text-sm tracking-[0.18em] text-white/60">{content.footerKicker}</p>
          <InlineTextReveal
            as="h2"
            className="mt-7 w-full"
            textClassName="justify-center text-[clamp(4.4rem,13vw,13rem)] font-medium leading-[0.76] tracking-[-0.075em]"
            mutedClassName="text-white/16"
          >
            {"LET'S\nBUILD."}
          </InlineTextReveal>
          <motion.div whileHover={{ scale: 1.045 }} whileTap={{ scale: 0.97 }} className="mt-12">
            <LiquidMetalLink href="mailto:CST2409040@xmu.edu.my" className="group min-w-[260px]">
              CST2409040@xmu.edu.my
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </LiquidMetalLink>
          </motion.div>
        </div>
        <div className="flex flex-col gap-6 border-t border-white/10 pt-7 text-sm text-white/38 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-5">
            <a href="https://github.com/desperati0n" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-white">
              <Code2 className="h-4 w-4" /> GitHub
            </a>
            <a href="#home" className="transition-colors hover:text-white">{content.backToTop}</a>
          </div>
          <p>© 2026</p>
        </div>
      </div>
    </footer>
  );
}

export function PortfolioPage({ locale = 'en' }: { locale?: PortfolioLocale }) {
  const content = siteContent[locale];
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
    <main lang={locale === 'en' ? 'en' : 'zh-CN'} ref={main} className="relative isolate w-full max-w-full overflow-x-hidden bg-black text-white">
      <DocumentLanguage lang={locale === 'en' ? 'en' : 'zh-CN'} />
      <ParticlesBackground className="pointer-events-none fixed inset-0 z-0 h-screen w-full overflow-hidden" />
      <PortfolioDock locale={locale} />
      <section id="home" className="relative z-10 flex min-h-screen items-center justify-center overflow-hidden bg-black px-5 pb-24 pt-32 sm:px-10">
        <ShaderBackground className="absolute inset-0 h-full w-full opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(0,0,0,.22),rgba(0,0,0,.58)_72%,#000_100%)]" />
        <div className="ambient-grid absolute inset-0 opacity-35 mix-blend-overlay" />
        <div className="absolute left-1/2 top-1/4 h-[38rem] w-[38rem] -translate-x-1/2 rounded-full bg-white/[0.025] blur-[110px]" />
        <div className="relative z-10 mx-auto flex w-full max-w-6xl -translate-y-10 flex-col items-center text-center">
          <InlineTextReveal
            as="h1"
            className="w-full max-w-6xl"
            textClassName="justify-center text-balance text-[clamp(3.35rem,8.4vw,8rem)] font-medium leading-[0.88] tracking-[-0.065em]"
            mutedClassName="text-white/18"
          >
            {content.heroTitle}
          </InlineTextReveal>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95 }} className="mt-7 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
            {content.heroBody}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-14 flex w-full justify-center sm:mt-16"
          >
            <MagneticLink href="#projects" primary>
              {content.projectsCta}
              <ArrowDownRight className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
            </MagneticLink>
          </motion.div>
        </div>
        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-white/30">
          <span className="h-px w-9 bg-white/20" /> SCROLL TO EXPLORE <span className="h-px w-9 bg-white/20" />
        </div>
      </section>
      <div className="relative z-10">
        <SectionFade />
        <StorySection locale={locale} />
        <ProjectsSection locale={locale} />
        <SkillsCarousel locale={locale} />
        <MotionFooter locale={locale} />
      </div>
    </main>
  );
}
