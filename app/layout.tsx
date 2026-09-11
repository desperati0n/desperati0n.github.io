import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Qian Cheng — AI Applications & Backend Engineering',
  description: 'Qian Cheng’s portfolio, focused on AI applications, backend engineering, RAG, MCP, and computer vision.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
