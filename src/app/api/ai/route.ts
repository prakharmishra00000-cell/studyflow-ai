import { NextResponse } from 'next/server';
import { StudyAI } from '@/lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, prompt, context, subjectName, topicName, questionCount, difficulty, rawText, paperText } = body;

    const apiKey = process.env.GEMINI_API_KEY;

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
