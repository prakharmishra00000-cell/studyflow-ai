import { NextResponse } from 'next/server';
import { StudyAI } from '@/lib/ai/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, prompt, context, project } = body;

    if (action === 'mentorRespond') {
      const reply = await StudyAI.mentorRespond(prompt, context);
      return NextResponse.json({ reply });
    }

    if (action === 'generateProjectPlan') {
      const steps = await StudyAI.generateProjectPlan(project);
      return NextResponse.json({ steps });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
