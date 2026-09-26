import { NextResponse } from 'next/server';
import { StudyAI } from '@/lib/ai/gemini';

export const maxDuration = 60;
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, prompt, context, subjectName, topicName, questionCount, difficulty, rawText, paperText, subjects, examName } = body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (action === 'researchSyllabus') {
      const syllabus = await StudyAI.researchExamSyllabus(subjects || [], examName || 'Competitive Exam');
      return NextResponse.json({ syllabus });
    }

    if (action === 'copilot') {
      const reply = await StudyAI.copilotRespond(prompt, context, apiKey);
      return NextResponse.json({ reply });
    }

    if (action === 'generateQuiz') {
      const questions = await StudyAI.generateQuiz(subjectName, topicName, questionCount, difficulty, apiKey);
      return NextResponse.json({ questions });
    }

    if (action === 'extractSyllabus') {
      const syllabus = await StudyAI.extractSyllabus(rawText, apiKey);
      return NextResponse.json({ syllabus });
    }

    if (action === 'analyzePYQ') {
      const analysis = await StudyAI.analyzePYQ(paperText, apiKey);
      return NextResponse.json({ analysis });
    }

    return NextResponse.json({ error: 'Invalid action requested' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/ai error:', error);
    return NextResponse.json({ error: error?.message || 'Server error processing request' }, { status: 500 });
  }
}
