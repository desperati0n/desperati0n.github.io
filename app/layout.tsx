import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '林述 — 计算机科学学生',
  description: '计算机科学学生林述的个人简历与项目作品集。',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" className="dark">
      <body>{children}</body>
    </html>
  );
}
