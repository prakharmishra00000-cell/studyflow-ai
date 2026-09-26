import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { StudyProvider } from '@/lib/store/StudyContext';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'STUDYFLOW AI — Your AI-Powered Study System',
  description: 'Advanced AI study planner, spaced repetition engine, and learning assistant for university and competitive exams.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100">
        <StudyProvider>
          {children}
        </StudyProvider>
      </body>
    </html>
  );
}
