import { ArrowLeft, ArrowUpRight, Code2 } from 'lucide-react';

import { DocumentLanguage } from '@/components/document-language';
import { SiriWave } from '@/components/ui/siri-wave';

type ProjectsLocale = 'en' | 'zh';

const projectsZh = [
  {
    id: 'bacterial-segmentation',
    number: '01',
    title: '细菌显微图像实例分割评测与部署',
    summary: '从数据集治理、模型统一评测，到 GPU 推理服务与 Agent Skill 封装的一体化计算机视觉项目。',
    visual: {
      src: '/projects/bacterial-segmentation-comparison.png',
      alt: '四种细菌实例分割模型在同一张明场显微图像上的结果与局部细节对比',
      caption: '实验结果 / 四种模型的实例分割效果与局部细节对比',
      sourceLabel: '查看 benchmark',
      sourceHref: 'https://github.com/desperati0n/bacterial-segmentation-benchmark',
      imageClassName: 'w-full',
      dark: false,
      custom: false,
    },
    links: [
      { label: 'benchmark', href: 'https://github.com/desperati0n/bacterial-segmentation-benchmark' },
      { label: 'cellpose-kit', href: 'https://github.com/desperati0n/cellpose-kit' },
    ],
    facts: [
      '整理并校验 2,900+ 对显微图像与既有掩膜，建立统一评测集及人工复核的高置信度 GT 子集。',
      '统一评测 Cellpose-SAM、MicroSAM DeepBacs 与 Omnipose，从实例精度、边界质量、计数误差及 split / merge 等维度分析差异。',
      '将 Cellpose-SAM 封装为 Docker + FastAPI GPU 推理服务，并实现可安装 Agent Skill，支持鉴权、流式上传、安全解压及结构化结果输出。',
    ],
    stack: ['Python', 'Cellpose-SAM', 'FastAPI', 'Docker', 'GPU Inference'],
  },
  {
    id: 'ticket-service',
    number: '02',
    title: '企业 IT 运维工单 Agent 与 MCP 平台',
    summary: '面向企业运维流程的异步工单系统，以及可由外部 Agent 安全调用的 MCP 工具平台。',
    visual: {
      src: '/projects/ticket-service-architecture.svg',
      alt: '企业 IT 运维工单 Agent 与 MCP 平台总体架构图',
      caption: '系统架构 / 外部 LLM、MCP、Redis 队列与数据层之间的调用关系',
      sourceLabel: '查看架构文档',
      sourceHref: 'https://github.com/desperati0n/ticket_service/blob/main/ticket_service_skill/docs/mcp-server.md',
      imageClassName: 'mx-auto max-h-[46rem] w-auto max-w-full',
      dark: true,
      custom: false,
    },
    links: [{ label: 'ticket_service', href: 'https://github.com/desperati0n/ticket_service' }],
    facts: [
      '使用 FastAPI、Redis Streams、MySQL、MongoDB 与 SSE 构建异步工单链路。',
      '支持批量任务、多 Worker、Pending 接管、处理心跳及会话级并发控制。',
      '构建 LangChain 工单 Agent，并重构为包含 8 个工具的 Streamable HTTP MCP 服务，覆盖权限校验、工单 CRUD、任务归档、建单幂等与删除二次确认。',
    ],
    stack: ['FastAPI', 'Redis Streams', 'MySQL', 'MongoDB', 'LangChain', 'MCP'],
  },
  {
    id: 'rag-agent',
    number: '03',
    title: 'RAG 文档问答与工具调用 Agent',
    summary: '一个面向多格式知识库的端到端 RAG 实践项目，兼顾召回质量、模型兼容与异常处理。',
    visual: {
      src: '/projects/rag-agent-architecture.svg',
      alt: 'RAG 文档问答与工具调用 Agent 系统架构图',
      caption: '系统架构 / 检索、重排、向量数据库、LLM 与本地工具的协作链路',
      sourceLabel: '查看架构文档',
      sourceHref: 'https://github.com/desperati0n/rag-agent-tutorial/blob/main/TECHNICAL.md',
      imageClassName: 'w-full',
      dark: true,
      custom: true,
      kind: 'rag',
    },
    links: [{ label: 'rag-agent-tutorial', href: 'https://github.com/desperati0n/rag-agent-tutorial' }],
    facts: [
      '实现多格式文档解析、分块、Embedding、ChromaDB 向量召回、Reranker 精排与 LLM 回答链路。',
      '支持 PDF、Word、PPT、Excel、Markdown 与 TXT。',
      '封装 OpenAI 兼容模型接口及多轮 Tool Calling 循环，处理非法 JSON、未知工具和工具异常，并通过环境变量统一管理配置。',
    ],
    stack: ['RAG', 'ChromaDB', 'Embedding', 'Reranker', 'Tool Calling', 'OpenAI API'],
  },
];

const projectsEn = [
  {
    id: 'bacterial-segmentation',
    number: '01',
    title: 'Benchmarking and Deployment of Bacterial Instance Segmentation Models',
    summary: 'An end-to-end computer vision project spanning dataset curation, unified model evaluation, and deployment as a GPU inference service with an Agent Skill.',
    visual: {
      src: '/projects/bacterial-segmentation-comparison.png',
      alt: 'Comparison of four bacterial instance segmentation models on the same bright-field microscopy image, including detailed crops',
      caption: 'Experimental results / Instance segmentation outputs and detailed comparisons across four models',
      sourceLabel: 'View benchmark',
      sourceHref: 'https://github.com/desperati0n/bacterial-segmentation-benchmark',
      imageClassName: 'w-full',
      dark: false,
      custom: false,
    },
    links: [
      { label: 'Benchmark', href: 'https://github.com/desperati0n/bacterial-segmentation-benchmark' },
      { label: 'Deployment Kit', href: 'https://github.com/desperati0n/cellpose-kit' },
    ],
    facts: [
      'Curated and validated more than 2,900 microscopy image–mask pairs, creating a standardized benchmark and a manually reviewed, high-confidence ground-truth subset.',
      'Benchmarked Cellpose-SAM, MicroSAM DeepBacs Specialist, and Omnipose using instance-level accuracy, boundary quality, counting error, and split/merge analysis.',
      'Packaged Cellpose-SAM as a Dockerized FastAPI GPU inference service with authentication, streaming uploads, safe extraction, and structured instance-level results.',
    ],
    stack: ['Python', 'Cellpose-SAM', 'FastAPI', 'Docker', 'GPU Inference'],
  },
  {
    id: 'ticket-service',
    number: '02',
    title: 'IT Service Desk Agent and MCP Platform',
    summary: 'An asynchronous ticketing system for enterprise IT operations, paired with an MCP tool platform that external agents can call through a controlled interface.',
    visual: {
      src: '',
      alt: 'Architecture of the IT service desk agent and MCP platform',
      caption: 'System architecture / Request flow across the external LLM, MCP layer, Redis queue, workers, and data stores',
      sourceLabel: 'View architecture docs',
      sourceHref: 'https://github.com/desperati0n/ticket_service/blob/main/ticket_service_skill/docs/mcp-server.md',
      imageClassName: 'w-full',
      dark: true,
      custom: true,
      kind: 'ticket',
    },
    links: [{ label: 'ticket_service', href: 'https://github.com/desperati0n/ticket_service' }],
    facts: [
      'Built an asynchronous ticket-processing pipeline with FastAPI, Redis Streams, MySQL, MongoDB, and server-sent events.',
      'Supported batch requests, multiple workers, pending-task recovery, processing heartbeats, and session-level concurrency control.',
      'Developed a LangChain ticket agent and reorganized its capabilities as an eight-tool Streamable HTTP MCP service with authorization checks, idempotent creation, archiving, and confirmation for destructive actions.',
    ],
    stack: ['FastAPI', 'Redis Streams', 'MySQL', 'MongoDB', 'LangChain', 'MCP'],
  },
  {
    id: 'rag-agent',
    number: '03',
    title: 'RAG Document Question Answering and Tool-Using Agent',
    summary: 'An end-to-end RAG project for multi-format knowledge bases, designed around retrieval quality, model compatibility, and resilient tool execution.',
    visual: {
      src: '',
      alt: 'Architecture of the RAG document question-answering and tool-using agent',
      caption: 'System architecture / Retrieval, reranking, vector storage, LLM reasoning, and local tool execution',
      sourceLabel: 'View architecture docs',
      sourceHref: 'https://github.com/desperati0n/rag-agent-tutorial/blob/main/TECHNICAL.md',
      imageClassName: 'w-full',
      dark: true,
      custom: true,
      kind: 'rag',
    },
    links: [{ label: 'rag-agent-tutorial', href: 'https://github.com/desperati0n/rag-agent-tutorial' }],
    facts: [
      'Implemented document parsing, chunking, embedding, ChromaDB retrieval, reranking, and LLM-based answering across PDF, Word, PowerPoint, Excel, Markdown, and text files.',
      'Built an OpenAI-compatible model interface and a multi-turn tool-calling loop with handling for malformed JSON, unknown tools, and tool failures.',
      'Exposed model, vector-store, parser, and credential settings through environment-based configuration for reproducible deployment.',
    ],
    stack: ['RAG', 'ChromaDB', 'Embeddings', 'Reranking', 'Tool Calling', 'OpenAI API'],
  },
];

function RagArchitectureDiagram({ locale }: { locale: ProjectsLocale }) {
  const english = locale === 'en';
  const nodes = [
    { x: 40, y: 68, width: 140, label: english ? 'CLI user' : '命令行用户' },
    { x: 230, y: 68, width: 140, label: 'main.py' },
    { x: 420, y: 68, width: 140, label: 'Agent' },
    { x: 610, y: 68, width: 150, label: english ? 'User query' : '用户问题' },
    { x: 40, y: 248, width: 160, label: 'GPUStack', detail: 'Embedding' },
    { x: 245, y: 248, width: 180, label: 'ChromaDB', detail: english ? 'Vector store' : '向量数据库' },
    { x: 470, y: 248, width: 150, label: english ? 'Candidate chunks' : '候选文档块' },
    { x: 665, y: 248, width: 180, label: 'GPUStack', detail: 'Reranker' },
    { x: 890, y: 248, width: 190, label: english ? 'Relevant context' : '最相关文档' },
    { x: 40, y: 438, width: 260, label: english ? 'History + RAG context' : '历史 + RAG 上下文', detail: english ? '+ tool definitions' : '+ 工具说明' },
    { x: 350, y: 438, width: 200, label: english ? 'OpenAI-compatible LLM' : 'OpenAI 兼容 LLM' },
    { x: 600, y: 438, width: 190, label: english ? 'Answer or tool_call' : '回答或 tool_call' },
    { x: 970, y: 438, width: 160, label: english ? 'Final answer' : '最终回答' },
    { x: 630, y: 565, width: 260, label: english ? 'Local tools' : '本地工具', detail: english ? 'Return tool results' : '工具结果回填' },
  ];

  return (
    <div className="overflow-x-auto bg-[#0d1117] p-3 sm:p-6">
      <svg
        viewBox="0 0 1170 650"
        role="img"
        aria-label={english ? 'RAG document question-answering and tool-using agent flowchart' : 'RAG 文档问答与工具调用 Agent 的节点流程图'}
        className="block h-auto min-w-[860px] w-full"
      >
        <defs>
          <marker id="rag-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#c7c7c7" />
          </marker>
        </defs>

        <g fill="none" stroke="#c7c7c7" strokeWidth="1.5" markerEnd="url(#rag-arrow)">
          <path d="M180 98 H230" />
          <path d="M370 98 H420" />
          <path d="M560 98 H610" />
          <path d="M685 128 C685 190 120 178 120 248" />
          <path d="M200 278 H245" />
          <path d="M425 278 H470" />
          <path d="M620 278 H665" />
          <path d="M845 278 H890" />
          <path d="M985 308 C985 375 170 362 170 438" />
          <path d="M300 468 H350" />
          <path d="M550 468 H600" />
          <path d="M790 468 H970" />
          <path d="M695 498 V565" />
          <path d="M890 595 C1030 595 1050 540 1050 498" />
        </g>

        <g fontFamily="Arial, sans-serif" fontSize="13" fill="#d4d4d4">
          <g transform="translate(286 160)">
            <rect x="-46" y="-13" width="92" height="26" fill="#55585c" />
            <text textAnchor="middle" dominantBaseline="central">{english ? 'Retrieve' : '发起检索'}</text>
          </g>
          <g transform="translate(585 350)">
            <rect x="-52" y="-13" width="104" height="26" fill="#55585c" />
            <text textAnchor="middle" dominantBaseline="central">{english ? 'Build context' : '组装上下文'}</text>
          </g>
          <g transform="translate(876 454)">
            <rect x="-38" y="-13" width="76" height="26" fill="#55585c" />
            <text textAnchor="middle" dominantBaseline="central">{english ? 'Answer' : '直接回答'}</text>
          </g>
          <g transform="translate(738 532)">
            <rect x="-38" y="-13" width="76" height="26" fill="#55585c" />
            <text textAnchor="middle" dominantBaseline="central">tool_call</text>
          </g>
        </g>

        <g fontFamily="Arial, sans-serif">
          {nodes.map((node) => (
            <g key={`${node.x}-${node.y}`}>
              <rect
                x={node.x}
                y={node.y}
                width={node.width}
                height={60}
                rx={8}
                fill="#1c1c1c"
                stroke="#b7b7b7"
                strokeWidth="1.5"
              />
              <text
                x={node.x + node.width / 2}
                y={node.detail ? node.y + 25 : node.y + 31}
                textAnchor="middle"
                dominantBaseline="central"
                fill="#f0f0f0"
                fontSize="16"
              >
                {node.label}
              </text>
              {node.detail && (
                <text
                  x={node.x + node.width / 2}
                  y={node.y + 43}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#bdbdbd"
                  fontSize="13"
                >
                  {node.detail}
                </text>
              )}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}

function TicketArchitectureDiagram() {
  const nodes = [
    { x: 420, y: 30, width: 200, label: 'Employee request' },
    { x: 420, y: 135, width: 200, label: 'External agent host' },
    { x: 90, y: 250, width: 180, label: 'External LLM' },
    { x: 420, y: 250, width: 200, label: 'Bearer token check' },
    { x: 420, y: 365, width: 200, label: 'MCP frontend' },
    { x: 420, y: 480, width: 200, label: 'Redis Streams' },
    { x: 420, y: 595, width: 200, label: 'Backend worker' },
    { x: 220, y: 710, width: 190, label: 'MySQL', detail: 'Business records' },
    { x: 630, y: 710, width: 190, label: 'MongoDB', detail: 'Tool audit log' },
  ];

  return (
    <div className="overflow-x-auto bg-[#0d1117] p-3 sm:p-6">
      <svg
        viewBox="0 0 1040 800"
        role="img"
        aria-label="IT service desk agent and MCP platform architecture"
        className="block h-auto min-w-[720px] w-full"
      >
        <defs>
          <marker id="ticket-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#c7c7c7" />
          </marker>
        </defs>
        <g fill="none" stroke="#c7c7c7" strokeWidth="1.5" markerEnd="url(#ticket-arrow)">
          <path d="M520 88 V135" />
          <path d="M420 175 C310 175 260 220 260 250" />
          <path d="M270 280 C340 280 355 280 420 280" />
          <path d="M520 308 V365" />
          <path d="M520 423 V480" />
          <path d="M520 538 V595" />
          <path d="M470 653 C430 690 385 710 315 710" />
          <path d="M570 653 C610 690 655 710 725 710" />
          <path d="M620 395 C760 395 780 175 620 175" />
        </g>
        <g fontFamily="Arial, sans-serif">
          {nodes.map((node) => (
            <g key={node.label}>
              <rect x={node.x} y={node.y} width={node.width} height={58} rx={8} fill="#1c1c1c" stroke="#b7b7b7" strokeWidth="1.5" />
              <text x={node.x + node.width / 2} y={node.detail ? node.y + 23 : node.y + 30} textAnchor="middle" dominantBaseline="central" fill="#f0f0f0" fontSize="16">
                {node.label}
              </text>
              {node.detail && (
                <text x={node.x + node.width / 2} y={node.y + 42} textAnchor="middle" dominantBaseline="central" fill="#bdbdbd" fontSize="13">
                  {node.detail}
                </text>
              )}
            </g>
          ))}
        </g>
        <g fontFamily="Arial, sans-serif" fontSize="13" fill="#d4d4d4">
          <text x="545" y="115">Natural language</text>
          <text x="280" y="237">Model inference</text>
          <text x="535" y="344">MCP tool call</text>
          <text x="535" y="459">Enqueue and await</text>
          <text x="535" y="575">Command</text>
          <text x="725" y="310">Tool result</text>
        </g>
      </svg>
    </div>
  );
}

export function ProjectsPageContent({ locale }: { locale: ProjectsLocale }) {
  const english = locale === 'en';
  const projects = english ? projectsEn : projectsZh;
  const copy = english
    ? {
        homeHref: '/',
        home: 'Back to home',
        languageHref: '/zh/projects',
        language: '中文',
        lead: 'From prototypes, ',
        accent: 'to production-ready systems.',
        intro: 'A closer look at each project’s goals, core engineering work, technical stack, experimental results, and system architecture.',
        listLabel: 'Project list',
      }
    : {
        homeHref: '/zh',
        home: '返回首页',
        languageHref: '/projects',
        language: 'EN',
        lead: '从原型，',
        accent: '到可交付系统。',
        intro: '这里记录项目的目标、核心工作与技术栈，并通过实验结果和系统架构呈现关键实现。',
        listLabel: '项目列表',
      };

  return (
    <main lang={english ? 'en' : 'zh-CN'} className="relative min-h-screen overflow-hidden bg-neutral-950 text-white">
      <DocumentLanguage lang={english ? 'en' : 'zh-CN'} />
      <div className="pointer-events-none fixed inset-0 z-0 bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-28 pt-8 sm:px-10 sm:pt-10">
        <nav className="flex items-center justify-between border-b border-white/10 pb-6">
          <a href={copy.homeHref} className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
            <ArrowLeft className="size-4" /> {copy.home}
          </a>
          <div className="flex items-center gap-4">
            <a href={copy.languageHref} className="text-sm font-semibold text-white/60 transition-colors hover:text-white">{copy.language}</a>
            <a href="https://github.com/desperati0n" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white">
              <Code2 className="size-4" /> desperati0n
            </a>
          </div>
        </nav>

        <header className="py-24 sm:py-32">
          <p className="font-mono text-sm tracking-[0.18em] text-white/55">SELECTED PROJECTS / 2026</p>
          <h1 className="mt-6 max-w-5xl text-[clamp(3.6rem,9vw,8.5rem)] font-medium leading-[0.86] tracking-[-0.07em]">
            {copy.lead}
            <span className="text-white/20">{copy.accent}</span>
          </h1>
          <p className="mt-9 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            {copy.intro}
          </p>
        </header>

        <section className="space-y-5" aria-label={copy.listLabel}>
          {projects.map((project) => (
            <article key={project.id} id={project.id} className="scroll-mt-8 rounded-[2rem] border border-white/10 bg-black/85 p-6 shadow-[0_24px_80px_rgba(0,0,0,.35)] backdrop-blur-sm sm:p-9 lg:p-12">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
                      <SiriWave size={64} renderScale={1} />
                    </div>
                    <span className="font-mono text-sm text-white/35">{project.number} / 03</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.links.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/18 px-4 py-2.5 text-sm text-white/72 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white">
                        {link.label} <ArrowUpRight className="size-4" />
                      </a>
                    ))}
                  </div>
                </div>

                <div className="min-w-0">
                  <h2 className="text-3xl font-medium leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">{project.title}</h2>
                  <p className="mt-6 text-base leading-7 text-white/55 sm:max-w-4xl sm:text-lg">{project.summary}</p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span key={item} className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-xs text-white/48">{item}</span>
                    ))}
                  </div>

                  <figure className="mt-9 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035]">
                    <div className={project.visual.dark ? 'bg-[#0d1117]' : 'bg-[#f4f4f1] p-2 sm:p-4'}>
                      {project.visual.custom ? (
                        project.visual.kind === 'ticket'
                          ? <TicketArchitectureDiagram />
                          : <RagArchitectureDiagram locale={locale} />
                      ) : (
                        <img
                          src={project.visual.src}
                          alt={project.visual.alt}
                          className={`block h-auto rounded-xl object-contain ${project.visual.imageClassName} ${project.visual.dark ? 'p-3 sm:p-6' : ''}`}
                        />
                      )}
                    </div>
                    <figcaption className="flex flex-col gap-3 px-4 py-4 text-xs leading-5 text-white/50 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                      <span>{project.visual.caption}</span>
                      <a
                        href={project.visual.sourceHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex shrink-0 items-center gap-1.5 text-white/65 transition-colors hover:text-white"
                      >
                        {project.visual.sourceLabel} <ArrowUpRight className="size-3.5" />
                      </a>
                    </figcaption>
                  </figure>

                  <ul className="mt-9 grid gap-5 border-t border-white/10 pt-8 lg:grid-cols-3">
                    {project.facts.map((fact) => (
                      <li key={fact} className="border-l border-white/14 pl-5 text-sm leading-6 text-white/70 sm:text-base sm:leading-7">
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </section>

        <footer className="mt-20 flex justify-end border-t border-white/10 pt-7 text-sm text-white/40">
          <a href="mailto:CST2409040@xmu.edu.my" className="transition-colors hover:text-white">CST2409040@xmu.edu.my</a>
        </footer>
      </div>
    </main>
  );
}
