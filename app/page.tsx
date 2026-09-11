import { PortfolioPage } from '@/components/portfolio-page';

export const dynamic = 'force-static';

export default function HomePage() {
  return <PortfolioPage locale="en" />;
}
