import type { Metadata } from 'next';

import { PortfolioPage } from '@/components/portfolio-page';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '钱程 — AI 应用开发与后端工程',
  description: '钱程的个人简历与项目作品集，聚焦 AI 应用开发、后端工程、RAG、MCP 与计算机视觉。',
};

export default function ChineseHomePage() {
  return <PortfolioPage locale="zh" />;
}
