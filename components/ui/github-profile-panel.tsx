'use client';

import {
  Bell,
  BookOpen,
  Box,
  Cat,
  CircleDot,
  CirclePlus,
  Code2,
  FolderGit2,
  GitCommitHorizontal,
  GitPullRequest,
  Inbox,
  Link as LinkIcon,
  MapPin,
  Menu,
  MousePointerClick,
  Package,
  Rocket,
  Search,
  Star,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

type Project = {
  title: string;
  description: string;
  href: string;
  language: string;
};

type PortfolioLocale = 'en' | 'zh';

type Shot = {
  id: number;
  column: number;
  row: number;
};

const GRID_COLUMNS = 52;
const GRID_ROWS = 7;
const CELL_SIZE = 11;
const CELL_GAP = 3;
const CELL_PITCH = CELL_SIZE + CELL_GAP;
const CONTRIBUTION_COUNT = 160;
const monthLabels = [
  { label: 'Sep', start: 1, span: 4 },
  { label: 'Oct', start: 5, span: 4 },
  { label: 'Nov', start: 9, span: 5 },
  { label: 'Dec', start: 14, span: 4 },
  { label: 'Jan', start: 18, span: 4 },
  { label: 'Feb', start: 22, span: 5 },
  { label: 'Mar', start: 27, span: 4 },
  { label: 'Apr', start: 31, span: 4 },
  { label: 'May', start: 35, span: 5 },
  { label: 'Jun', start: 40, span: 4 },
  { label: 'Jul', start: 44, span: 4 },
  { label: 'Aug', start: 48, span: 5 },
];
const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const contributionColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

function createRandomContributions() {
  const totalCells = GRID_COLUMNS * GRID_ROWS;
  const pool = Array.from({ length: totalCells }, (_, index) => index);
  const randomValues = new Uint32Array(totalCells + CONTRIBUTION_COUNT);
  window.crypto.getRandomValues(randomValues);

  for (let index = pool.length - 1; index > 0; index -= 1) {
    const swapIndex = randomValues[pool.length - 1 - index] % (index + 1);
    [pool[index], pool[swapIndex]] = [pool[swapIndex], pool[index]];
  }

  return new Map(
    pool.slice(0, CONTRIBUTION_COUNT).map((cellIndex, index) => {
      const roll = randomValues[totalCells + index] & 255;
      const level = roll < 179 ? 1 : roll < 224 ? 2 : roll < 245 ? 3 : 4;
      return [cellIndex, level];
    }),
  );
}

function IconFrame({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span
      title={label}
      className="grid size-8 shrink-0 place-items-center rounded-md border border-[#30363d] text-[#8c959f]"
    >
      {children}
      <span className="sr-only">{label}</span>
    </span>
  );
}

function ContributionCalendar({ locale }: { locale: PortfolioLocale }) {
  const english = locale === 'en';
  const [playing, setPlaying] = useState(false);
  const [shipColumn, setShipColumn] = useState(25);
  const [shots, setShots] = useState<Shot[]>([]);
  const [destroyed, setDestroyed] = useState<Set<number>>(() => new Set());
  const [score, setScore] = useState(0);
  const [contributionCells, setContributionCells] = useState<Map<number, number>>(
    () => new Map(),
  );
  const gameRef = useRef<HTMLButtonElement>(null);
  const nextShotId = useRef(0);
  const heldKeys = useRef(new Set<string>());
  const shipColumnRef = useRef(25);
  const activeCells = useMemo(
    () => new Set(contributionCells.keys()),
    [contributionCells],
  );

  useEffect(() => {
    setContributionCells(createRandomContributions());
  }, []);

  function moveShip(direction: number) {
    setShipColumn((current) => {
      const next = Math.max(0, Math.min(GRID_COLUMNS - 1, current + direction));
      shipColumnRef.current = next;
      return next;
    });
  }

  function fireShot() {
    nextShotId.current += 1;
    setShots((current) => [
      ...current,
      {
        id: nextShotId.current,
        column: shipColumnRef.current,
        row: GRID_ROWS + 1,
      },
    ]);
  }

  useEffect(() => {
    if (!playing) return;

    const movementTimer = window.setInterval(() => {
      const left = heldKeys.current.has('ArrowLeft');
      const right = heldKeys.current.has('ArrowRight');
      if (left !== right) moveShip(left ? -1 : 1);
    }, 55);
    const firingTimer = window.setInterval(() => {
      if (heldKeys.current.has('Space')) fireShot();
    }, 120);

    return () => {
      window.clearInterval(movementTimer);
      window.clearInterval(firingTimer);
    };
  }, [playing]);

  useEffect(() => {
    if (!playing || shots.length === 0) return;

    const timer = window.setInterval(() => {
      setShots((currentShots) => {
        const hits: number[] = [];
        const nextShots = currentShots
          .map((shot) => ({ ...shot, row: shot.row - 1 }))
          .filter((shot) => {
            if (shot.row < 0) return false;
            const cellIndex = shot.column * GRID_ROWS + shot.row;
            if (
              shot.row < GRID_ROWS &&
              activeCells.has(cellIndex) &&
              !destroyed.has(cellIndex)
            ) {
              hits.push(cellIndex);
              return false;
            }
            return true;
          });

        if (hits.length > 0) {
          setScore((current) => (
            current + hits.reduce(
              (total, cellIndex) => total + (contributionCells.get(cellIndex) ?? 1) * 10,
              0,
            )
          ));
          setDestroyed((current) => new Set([...current, ...hits]));
        }
        return nextShots;
      });
    }, 95);

    return () => window.clearInterval(timer);
  }, [activeCells, destroyed, playing, shots.length]);

  function handleGameKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (!playing) return;

    const key =
      event.key === 'ArrowLeft' || event.key === 'ArrowRight'
        ? event.key
        : event.code === 'Space'
          ? 'Space'
          : null;
    if (!key) return;

    event.preventDefault();
    if (heldKeys.current.has(key)) return;
    heldKeys.current.add(key);

    if (key === 'ArrowLeft') moveShip(-1);
    if (key === 'ArrowRight') moveShip(1);
    if (key === 'Space') fireShot();
  }

  function releaseGameKey(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      heldKeys.current.delete(event.key);
    }
    if (event.code === 'Space') heldKeys.current.delete('Space');
  }

  function toggleGame() {
    setPlaying((current) => {
      const next = !current;
      if (next) window.requestAnimationFrame(() => gameRef.current?.focus());
      if (next) setScore(0);
      if (!next) {
        heldKeys.current.clear();
        setShots([]);
        setDestroyed(new Set());
        setScore(0);
      }
      return next;
    });
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-sm font-normal text-[#f0f6fc] sm:text-base">
          {english
            ? `${CONTRIBUTION_COUNT} contributions in the last year`
            : `过去一年有 ${CONTRIBUTION_COUNT} 次贡献`}
        </h3>
        <div className="flex flex-wrap items-center justify-end gap-3">
          {playing && (
            <>
              <span
                aria-live="polite"
                className="rounded-md border border-[#238636]/55 bg-[#0e4429]/45 px-2.5 py-1 font-mono text-xs font-semibold tabular-nums text-[#7ee787]"
              >
                SCORE {score.toString().padStart(4, '0')}
              </span>
              <span className="font-mono text-[11px] text-[#7ee787]/80">
                {english ? '← → move · Space to fire' : '← → 左右移动 · 空格键发射'}
              </span>
            </>
          )}
          <button
            type="button"
            onClick={toggleGame}
            className={`rounded-md border px-3 py-1 text-xs font-medium transition-colors ${
              playing
                ? 'border-[#39d353]/60 bg-[#0e4429]/70 text-[#7ee787]'
                : 'border-[#30363d] bg-[#21262d] text-[#c9d1d9] hover:bg-[#30363d]'
            }`}
          >
            {playing
              ? (english ? 'Exit game' : '退出游戏')
              : (english ? 'Play calendar' : '开始游戏')}
          </button>
        </div>
      </div>

      <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_88px]">
        <button
          type="button"
          ref={gameRef}
          tabIndex={playing ? 0 : -1}
          onKeyDown={handleGameKey}
          onKeyUp={releaseGameKey}
          onBlur={() => heldKeys.current.clear()}
          aria-label={
            playing
              ? (english
                  ? 'Contribution shooter. Use left and right arrows to move, and space to shoot.'
                  : '贡献日历射击游戏。使用左右方向键移动，按空格键发射。')
              : (english ? 'GitHub contribution calendar' : 'GitHub 贡献日历')
          }
          className={`block w-full overflow-x-auto rounded-md border bg-[#0d1117]/70 p-3 text-left outline-none transition-shadow [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
            playing ? 'cursor-crosshair border-[#39d353]/55 shadow-[0_0_0_1px_rgba(57,211,83,.18),0_0_32px_rgba(57,211,83,.08)]' : 'border-[#30363d]'
          }`}
        >
          <div className="ml-auto w-[765px]">
          <div className="grid grid-cols-[32px_725px] gap-2">
            <span />
            <div
              className="grid gap-[3px] text-[10px] text-[#8c959f]"
              style={{ gridTemplateColumns: `repeat(${GRID_COLUMNS}, ${CELL_SIZE}px)` }}
            >
              {monthLabels.map((month) => (
                <span
                  key={month.label}
                  style={{ gridColumn: `${month.start} / span ${month.span}` }}
                >
                  {month.label}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-2 grid grid-cols-[32px_725px] gap-2">
            <div
              className="grid w-8 shrink-0 text-[9px] leading-none text-[#8c959f]"
              style={{
                gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
                gap: `${CELL_GAP}px`,
              }}
            >
              {weekdayLabels.map((weekday) => (
                <span key={weekday} className="flex items-center">
                  {weekday}
                </span>
              ))}
            </div>

            <div className="relative flex w-[725px] gap-[3px] pb-14">
              {Array.from({ length: GRID_COLUMNS }, (_, column) => (
                <div
                  key={column}
                  className="grid shrink-0 gap-[3px]"
                  style={{ gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)` }}
                >
                  {Array.from({ length: GRID_ROWS }, (_, row) => {
                    const cellIndex = column * GRID_ROWS + row;
                    const level = contributionCells.get(cellIndex) ?? 0;
                    const isDestroyed = destroyed.has(cellIndex);
                    return (
                      <span
                        key={row}
                        title={`${level === 0 ? 'No' : level} contributions`}
                        className={`size-[11px] rounded-[2px] border border-black/10 transition-[transform,opacity,background-color] duration-200 ${
                          isDestroyed ? 'scale-0 opacity-0' : ''
                        }`}
                        style={{ backgroundColor: contributionColors[level] }}
                      />
                    );
                  })}
                </div>
              ))}

              {playing && (
                <>
                  {shots.map((shot) => (
                    <span
                      key={shot.id}
                      aria-hidden="true"
                      className="pointer-events-none absolute size-1 rounded-full bg-[#7ee787] shadow-[0_0_7px_2px_rgba(126,231,135,.7)]"
                      style={{
                        left: `${shot.column * CELL_PITCH + CELL_SIZE / 2}px`,
                        top: `${shot.row * CELL_PITCH + CELL_SIZE / 2}px`,
                      }}
                    />
                  ))}
                  <Rocket
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-1 h-5 w-5 -translate-x-1/2 -rotate-45 text-[#7ee787] drop-shadow-[0_0_6px_rgba(126,231,135,.7)]"
                    style={{ left: `${shipColumn * CELL_PITCH + CELL_SIZE / 2}px` }}
                  />
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-[32px_725px] gap-2">
            <span />
            <div className="flex items-center justify-between gap-4 text-[10px] text-[#8c959f]">
              <span>
                {playing
                  ? (english ? 'Keep focus here to use the keyboard controls' : '保持焦点即可使用键盘控制')
                  : (english ? 'Select Play calendar to launch the contribution shooter' : '选择“开始游戏”启动贡献日历射击游戏')}
              </span>
              <div className="flex items-center gap-1">
                <span>{english ? 'Less' : '少'}</span>
                {contributionColors.map((color) => (
                  <span key={color} className="size-2.5 rounded-[2px]" style={{ backgroundColor: color }} />
                ))}
                <span>{english ? 'More' : '多'}</span>
              </div>
            </div>
          </div>
          </div>
        </button>

        <aside aria-label={english ? 'Contribution years' : '贡献年份'} className="flex gap-2 lg:flex-col">
          {['2026', '2025', '2024'].map((year, index) => (
            <span
              key={year}
              aria-current={index === 0 ? 'true' : undefined}
              className={`flex min-h-11 flex-1 items-center rounded-md px-4 text-sm lg:flex-none ${
                index === 0
                  ? 'bg-[#1f6feb] font-medium text-white'
                  : 'text-[#8c959f]'
              }`}
            >
              {year}
            </span>
          ))}
        </aside>
      </div>
    </div>
  );
}

const profileCopy = {
  en: {
    name: 'Qian Cheng',
    bio: 'Computer Science undergraduate focused on AI agents, RAG, MCP, computer vision, and backend engineering.',
    contact: 'Contact me',
    popular: 'Popular repositories',
    repositories: 'repositories',
    cardHint: 'Select a card to view the project',
    activity: 'Contribution activity',
    events: [
      { month: 'September 2026', icon: GitCommitHorizontal, title: 'Completed an instance segmentation benchmark and deployment pipeline', detail: 'bacterial-segmentation-benchmark · cellpose-kit' },
      { month: 'August 2026', icon: GitPullRequest, title: 'Built an enterprise ticketing agent and MCP service', detail: 'ticket_service · 8 tools · asynchronous workers' },
      { month: 'Independent project', icon: Box, title: 'Implemented a RAG document Q&A and tool-calling pipeline', detail: 'rag-agent-tutorial · retrieval · reranking · tool calling' },
    ],
  },
  zh: {
    name: '钱程',
    bio: '计算机科学本科生，关注 AI Agent、RAG、MCP、计算机视觉与后端工程。',
    contact: '联系我',
    popular: '热门仓库',
    repositories: '个仓库',
    cardHint: '点击卡片查看项目详情',
    activity: '贡献活动',
    events: [
      { month: '2026 年 9 月', icon: GitCommitHorizontal, title: '完成实例分割评测与部署', detail: 'bacterial-segmentation-benchmark · cellpose-kit' },
      { month: '2026 年 8 月', icon: GitPullRequest, title: '构建企业工单 Agent 与 MCP 服务', detail: 'ticket_service · 8 tools · asynchronous workers' },
      { month: '独立项目', icon: Box, title: '实现 RAG 文档问答与工具调用链路', detail: 'rag-agent-tutorial · retrieval · reranking · tool calling' },
    ],
  },
} satisfies Record<PortfolioLocale, object>;

export function GithubProfilePanel({
  projects,
  locale,
}: {
  projects: Project[];
  locale: PortfolioLocale;
}) {
  const copy = profileCopy[locale];
  return (
    <div className="overflow-hidden rounded-[10px] border border-[#30363d] bg-[#0d1117]/88 shadow-[0_24px_80px_rgba(0,0,0,.46)] backdrop-blur-xl">
      <header className="border-b border-[#30363d] bg-[#010409]/85">
        <div className="flex min-h-16 items-center gap-3 px-3 sm:px-4">
          <IconFrame label="Menu">
            <Menu className="size-4" />
          </IconFrame>
          <span className="grid size-8 place-items-center rounded-full bg-[#f0f6fc] text-[#010409]" title="GitHub">
            <Cat className="size-5" aria-hidden="true" />
            <span className="sr-only">GitHub</span>
          </span>
          <span className="text-sm font-semibold text-[#f0f6fc]">desperati0n</span>

          <div className="ml-auto hidden h-8 w-64 items-center gap-2 rounded-md border border-[#30363d] px-3 text-xs text-[#8c959f] lg:flex">
            <Search className="size-4" />
            <span>Type / to search</span>
          </div>
          <div className="hidden h-5 w-px bg-[#30363d] sm:block" />
          <div className="hidden items-center gap-2 sm:flex">
            <IconFrame label="Create new">
              <CirclePlus className="size-4" />
            </IconFrame>
            <IconFrame label="Issues">
              <CircleDot className="size-4" />
            </IconFrame>
            <IconFrame label="Pull requests">
              <GitPullRequest className="size-4" />
            </IconFrame>
            <IconFrame label="Inbox">
              <Inbox className="size-4" />
            </IconFrame>
            <IconFrame label="Notifications">
              <Bell className="size-4" />
            </IconFrame>
          </div>
        </div>

        <nav
          aria-label="GitHub profile navigation"
          className="flex gap-1 overflow-x-auto px-3 text-xs text-[#f0f6fc] [scrollbar-width:none] sm:px-4 [&::-webkit-scrollbar]:hidden"
        >
          {[
            { label: 'Overview', icon: BookOpen, active: true },
            { label: 'Repositories', icon: Code2, count: projects.length },
            { label: 'Projects', icon: FolderGit2 },
            { label: 'Packages', icon: Package },
            { label: 'Stars', icon: Star },
          ].map(({ label, icon: Icon, count, active }) => (
            <span
              key={label}
              className={`relative flex shrink-0 items-center gap-2 px-3 py-3 ${active ? 'font-semibold' : 'text-[#8c959f]'}`}
            >
              <Icon className="size-4" />
              {label}
              {count !== undefined && <span className="rounded-full bg-[#30363d] px-1.5 py-0.5 text-[10px] text-[#f0f6fc]">{count}</span>}
              {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-[#f78166]" />}
            </span>
          ))}
        </nav>
      </header>

      <div className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:p-8">
        <aside className="lg:pt-2">
          <h2 className="text-2xl font-semibold leading-tight text-[#f0f6fc]">{copy.name}</h2>
          <p className="mt-1 text-lg font-light text-[#8c959f]">desperati0n</p>
          <p className="mt-4 text-sm leading-6 text-[#c9d1d9]">{copy.bio}</p>
          <a
            href="#contact"
            className="mt-4 block rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-center text-xs font-semibold text-[#f0f6fc] transition-colors hover:bg-[#30363d]"
          >
            {copy.contact}
          </a>
          <div className="mt-4 space-y-2 border-t border-[#21262d] pt-4 text-xs text-[#8c959f]">
            <p className="flex items-center gap-2"><MapPin className="size-4" /> Xiamen University</p>
            <a href="https://github.com/desperati0n" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-[#f0f6fc]"><LinkIcon className="size-4" /> github.com/desperati0n</a>
          </div>
        </aside>

        <main className="min-w-0">
          <section>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-sm font-normal text-[#f0f6fc] sm:text-base">{copy.popular}</h3>
              <div className="flex flex-wrap items-center justify-end gap-3 text-xs">
                <span className="text-[#4493f8]">{projects.length} {copy.repositories}</span>
                <span className="inline-flex items-center gap-1.5 text-[#8c959f]">
                  <MousePointerClick className="size-3.5 text-[#4493f8]" />
                  {copy.cardHint}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {projects.map((project) => (
                <a
                  key={project.title}
                  href={project.href}
                  className="group flex min-h-32 flex-col rounded-md border border-[#30363d] bg-[#0d1117]/72 p-4 transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-[#8c959f] hover:bg-[#161b22]/80"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h4 className="min-w-0 text-sm font-semibold text-[#4493f8] group-hover:underline">{project.title}</h4>
                    <span className="shrink-0 rounded-full border border-[#30363d] px-2 py-0.5 text-xs font-medium leading-4 text-[#8c959f]">Public</span>
                  </div>
                  <p className="mt-2 max-w-xl text-xs leading-5 text-[#8c959f] sm:text-[13px]">{project.description}</p>
                  <p className="mt-auto pt-4 text-[11px] text-[#8c959f]"><span className="mr-1.5 inline-block size-2 rounded-full bg-[#3572a5]" />{project.language}</p>
                </a>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <ContributionCalendar locale={locale} />
          </section>

          <section className="mt-8">
            <h3 className="text-sm font-normal text-[#f0f6fc] sm:text-base">{copy.activity}</h3>
            <div className="mt-4 space-y-6">
              {copy.events.map(({ month, icon: Icon, title, detail }) => (
                <article key={month} className="grid grid-cols-[20px_minmax(0,1fr)] gap-3">
                  <div className="relative flex justify-center">
                    <span className="absolute bottom-[-24px] top-5 w-px bg-[#30363d]" />
                    <span className="relative z-10 grid size-5 place-items-center rounded-full bg-[#21262d] text-[#8c959f]">
                      <Icon className="size-3" />
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-[#f0f6fc]">
                      <span>{month}</span>
                      <span className="h-px flex-1 bg-[#30363d]" />
                    </div>
                    <p className="mt-4 text-sm font-semibold text-[#c9d1d9]">{title}</p>
                    <p className="mt-1 text-xs text-[#8c959f]">{detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
