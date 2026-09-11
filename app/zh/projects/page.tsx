import type { Metadata } from 'next';

import { ProjectsPageContent } from '@/components/projects-page';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '项目经历 — 钱程',
  description: '钱程的 AI 应用、后端工程与计算机视觉项目经历。',
};

export default function ChineseProjectsPage() {
  return <ProjectsPageContent locale="zh" />;
}
