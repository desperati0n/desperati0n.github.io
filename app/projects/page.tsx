import type { Metadata } from 'next';

import { ProjectsPageContent } from '@/components/projects-page';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Projects — Qian Cheng',
  description: 'Selected AI application, backend engineering, and computer vision projects by Qian Cheng.',
};

export default function ProjectsPage() {
  return <ProjectsPageContent locale="en" />;
}
