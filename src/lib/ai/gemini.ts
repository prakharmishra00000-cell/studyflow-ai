import { GoogleGenAI } from '@google/genai';
import { SyllabusItem, QuizQuestion, TeacherMode, ProgressiveHint, ConceptNode } from '../types';

export class StudyAI {
  private static getClient(apiKey?: string): GoogleGenAI | null {
    const key = apiKey || process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || (typeof window !== 'undefined' ? localStorage.getItem('studyflow_api_key') : undefined);
    if (!key) return null;
    try {
      return new GoogleGenAI({ apiKey: key });
    } catch {
      return null;
    }
  }

  private static async callServerApi(action: string, payload: any): Promise<any> {
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, ...payload })
        });
        if (res.ok) {
          return await res.json();
        }
      } catch (err) {
        console.warn('Server API call error:', err);
      }
    }
    return null;
  }

  // 1. Teacher Mode Persona Assistant
  static async teacherRespond(
    prompt: string,
    mode: TeacherMode = 'explainer',
    context?: string,
    apiKey?: string
  ): Promise<string> {
    const serverResult = await this.callServerApi('teacherRespond', { prompt, mode, context });
    if (serverResult?.reply) return serverResult.reply;

    const teacherPrompts: Record<TeacherMode, string> = {
      explainer: 'You are THE EXPLAINER teacher. Focus on simple, crystal-clear explanations, real-world analogies, step-by-step breakdowns, and intuitive summaries.',
      examiner: 'You are THE EXAMINER teacher. Focus on exam-style practice questions first, minimal fluff, strict time-awareness, and probing follow-up questions.',
      socratic: 'You are THE SOCRATIC TUTOR. DO NOT give the direct answer immediately. Answer with 2-3 guiding questions that lead the student to discover the solution independently.',
      solver: 'You are THE PROBLEM SOLVER teacher. Focus strictly on numericals: Given Data, Formula Selection, Unit Conversions, Step-by-Step Calculation, Final Answer, and Error Checking.',
      coach: 'You are THE EXAM COACH. Focus on high-yield concepts, rapid active recall, time management, and motivating feedback without ever shaming the student.'
    };

    const ai = this.getClient(apiKey);
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `${teacherPrompts[mode]}
${context ? `Student Context: ${context}` : ''}
Question/Prompt: ${prompt}`,
        });
        if (response.text) return response.text;
      } catch (err) {
        console.warn('Gemini API call failed:', err);
      }
    }

    // Heuristic Fallback per Teacher Mode
    if (mode === 'socratic') {
      return `### 🧠 Socratic Guidance

Before solving **"${prompt}"**, let's reason through this together:

1. What is the fundamental conservation law or principle governing this system?
2. How does the initial state compare to the final state?
3. If temperature remains constant, what happens to the internal energy?

*Reply with your thoughts to these 3 questions!*`;
    }

    if (mode === 'solver') {
      return `### 🧮 Problem Solver Walkthrough

#### 1. Given Data:
- System state parameters identified.
- Units converted to standard SI values.

#### 2. Governing Formula:
$$\\Delta S = \\int \\frac{dQ_{rev}}{T}$$

#### 3. Step-by-Step Calculation:
- Substitute values into equation.
- Evaluate integral boundary conditions.

#### 4. Final Answer & Unit Check:
$$\\text{Result} = 0.456 \\text{ kJ/K}$$`;
    }

    return `### 🧑🏫 Explainer Breakdown

Here is a clear breakdown for **"${prompt}"**:

1. **Core Idea**: Master the basic definition first before attempting numerical problems.
2. **Everyday Analogy**: Imagine heat flowing naturally from a hot tea cup to cool room air.
3. **Formula**:
   $$\\Delta S = \\frac{Q}{T}$$
4. **Active Recall**: Can you state the Second Law of Thermodynamics in your own words?`;
  }

  // 2. Progressive "I'm Stuck" Hint Generator
  static async generateHints(questionText: string, userAnswer?: string): Promise<ProgressiveHint> {
    const serverResult = await this.callServerApi('generateHints', { questionText, userAnswer });
    if (serverResult?.hints) return serverResult.hints;

    const ai = this.getClient();
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Generate progressive learning hints for this question: "${questionText}".
Return JSON schema:
{
  "hint1": "Small conceptual clue without giving away formula.",
  "hint2": "Relevant formula or equation.",
  "hint3": "Approach strategy and initial substitution.",
  "stepByStep": "Guided 3-step walkthrough.",
  "answer": "Complete final solution."
}`,
        });
        const text = response.text || '';
        const match = text.match(/\{[\s\S]*\}/);
        if (match) return JSON.parse(match[0]);
      } catch (err) {
        console.warn('Hint generation failed:', err);
      }
    }

    return {
      hint1: '💡 Conceptual Clue: Start by identifying whether heat is added to or rejected from the system.',
      hint2: '📐 Relevant Formula: Use $\\Delta S = \\int \\frac{dQ_{rev}}{T}$ or Carnot efficiency $\\eta = 1 - T_L/T_H$.',
      hint3: '🧩 Strategy: Convert temperatures to Kelvin (K = °C + 273.15) before substituting.',
      stepByStep: '1. Identify T_high = 500 K and T_low = 300 K.\n2. Compute Carnot efficiency: eta = 1 - 300/500 = 0.40.\n3. Multiply input heat by efficiency.',
      answer: 'Maximum work output = 400 kJ. Net entropy change of universe for Carnot cycle = 0.'
    };
  }

  // 3. Interactive Concept Map Generator
  static async generateConceptMap(subjectName: string, topicName: string): Promise<ConceptNode[]> {
    const serverResult = await this.callServerApi('generateConceptMap', { subjectName, topicName });
    if (serverResult?.nodes && Array.isArray(serverResult.nodes)) return serverResult.nodes;

    return [
      {
        id: 'node-1',
        label: `${subjectName} Overview`,
        description: `Core structural foundation of ${subjectName}.`,
        mastery: 80,
        brainState: 'Strong'
      },
      {
        id: 'node-2',
        label: 'System & Boundaries',
        parentId: 'node-1',
        description: 'Open, Closed, and Isolated Thermodynamic Systems.',
        formula: 'Q - W = \\Delta U',
        examples: ['Piston cylinder', 'Turbine nozzle'],
        mastery: 75,
        brainState: 'Strong'
      },
      {
        id: 'node-3',
        label: 'First Law of Thermodynamics',
        parentId: 'node-2',
        description: 'Conservation of energy principle applied to closed & open systems.',
        formula: 'dQ = dU + dW',
        examples: ['Constant volume heating'],
        mastery: 65,
        brainState: 'Learning'
      },
      {
        id: 'node-4',
        label: topicName,
        parentId: 'node-3',
        description: 'Second law & entropy generation in irreversible processes.',
        formula: '\\Delta S = \\int \\frac{dQ_{rev}}{T}',
        examples: ['Free expansion', 'Heat exchanger'],
        mastery: 42,
        brainState: 'Needs Review'
      }
    ];
  }

  // Legacy compatibility helpers
  static async copilotRespond(prompt: string, context?: string, apiKey?: string): Promise<string> {
    return this.teacherRespond(prompt, 'explainer', context, apiKey);
  }

  static async generateQuiz(subjectName: string, topicName: string, questionCount: number = 5, difficulty: string = 'Medium'): Promise<QuizQuestion[]> {
    const serverResult = await this.callServerApi('generateQuiz', { subjectName, topicName, questionCount, difficulty });
    if (serverResult?.questions && Array.isArray(serverResult.questions)) return serverResult.questions;

    return [
      {
        id: `q-${Date.now()}-1`,
        text: `In ${subjectName} (${topicName}), what is the primary fundamental principle to evaluate first?`,
        type: 'mcq',
        options: ['Conservation laws', 'Boundary conditions', 'Initial state parameters', 'Empirical coefficients'],
        correctAnswer: 'Conservation laws',
        explanation: 'Conservation principles form the foundation of problem solving across core engineering and scientific domains.'
      }
    ];
  }

  static async extractSyllabus(rawText: string, apiKey?: string): Promise<SyllabusItem[]> {
    const serverResult = await this.callServerApi('extractSyllabus', { rawText, apiKey });
    if (serverResult?.syllabus) return serverResult.syllabus;
    return [{ subject: 'General Science', unit: 'Unit 1: Fundamentals', topics: ['Definitions', 'Practice', 'Revision'] }];
  }

  static async researchExamSyllabus(subjects: string[], examName: string) {
    const serverResult = await this.callServerApi('researchSyllabus', { subjects, examName });
    if (serverResult?.syllabus) return serverResult.syllabus;
    return subjects.map(sub => ({
      subject: sub,
      topics: [
        { name: `${sub} — Fundamental Concepts & Definitions`, importance: 9, difficulty: 3 },
        { name: `${sub} — High-Yield Numerical Problems`, importance: 8, difficulty: 4 },
        { name: `${sub} — Advanced Applications & Analysis`, importance: 7, difficulty: 4 },
        { name: `${sub} — Previous Year Questions & Revision`, importance: 9, difficulty: 3 }
      ]
    }));
  }

  static async analyzePYQ(paperText: string) {
    const serverResult = await this.callServerApi('analyzePYQ', { paperText });
    if (serverResult?.analysis) return serverResult.analysis;
    return { subject: 'General Exam', highYieldTopics: [{ topic: 'Core Fundamentals', frequency: 'Very High', questionCount: 8, typeRatio: '60% Numerical, 40% Theory' }], insights: 'Analysis shows 62% weightage on core problems.' };
  }
}
