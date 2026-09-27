import { GoogleGenAI } from '@google/genai';
import { UserRoadmap, RoadmapProject, ProjectStep } from '../types';

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

  /**
   * AI Mentor Assistant (Context-Aware Learning Companion)
   */
  static async mentorRespond(
    userPrompt: string,
    roadmapContext?: UserRoadmap | null,
    apiKey?: string
  ): Promise<string> {
    const serverResult = await this.callServerApi('mentorRespond', { prompt: userPrompt, context: roadmapContext });
    if (serverResult?.reply) return serverResult.reply;

    const skill = roadmapContext?.overview.skill || 'Python';
    const goal = roadmapContext?.overview.careerGoal || 'Data Analyst';
    const dailyHours = roadmapContext?.overview.dailyStudyTime || '2 hr';
    const tasks = roadmapContext?.dailyPlan.tasks || [];
    const pendingTask = tasks.find(t => t.status === 'pending')?.title || 'Python Data Structures';

    const ai = this.getClient(apiKey);
    if (ai) {
      try {
        const contextPrompt = `You are STUDYFLOW AI, an intelligent personal AI learning mentor.
User's Current Roadmap Context:
- Active Skill: ${skill}
- Career Goal: ${goal}
- Daily Study Time: ${dailyHours}
- Today's Primary Pending Task: ${pendingTask}
- Overall Progress: ${roadmapContext?.dailyPlan.progressPercentage || 40}%

User's Question: "${userPrompt}"

Instructions:
1. Provide a direct, encouraging, and actionable response tailored specifically to their roadmap and goal.
2. Use clear formatting with bullet points and bold highlights.
3. Be supportive, concise, and focused on practical progress.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: contextPrompt
        });
        if (response.text) return response.text;
      } catch (err) {
        console.warn('Gemini AI mentor call failed:', err);
      }
    }

    // Heuristic contextual fallback responses for key questions
    const qLower = userPrompt.toLowerCase();

    if (qLower.includes('what should i study today')) {
      return `### 🎯 Your Recommended Study Focus Today

Based on your **${skill} → ${goal}** roadmap:

1. **Primary Focus**: **${pendingTask}** (30 min)
2. **Next Step**: Watch recommended video tutorial & review documentation.
3. **Practice**: Solve 3 hands-on coding exercises.

*Tip: Complete this task today to maintain your streak!*`;
    }

    if (qLower.includes('don\'t understand') || qLower.includes('explain this') || qLower.includes('beginner')) {
      return `### 💡 Beginner-Friendly Explanation

Here is the simple, intuitive way to understand **${skill}**:

- **Analogy**: Imagine learning a language where grammar is syntax, and words are functions.
- **Key Takeaway**: Start by writing small 2-line scripts before building complex applications.
- **Rule of Thumb**: Don't memorize code; practice predicting what the code does line by line!`;
    }

    if (qLower.includes('practice questions') || qLower.includes('quiz')) {
      return `### 🧪 AI Practice Challenge: ${skill}

**Question 1**: What is the difference between a mutable and immutable data structure in ${skill}?
- **A)** Lists are immutable, Tuples are mutable
- **B)** Lists are mutable, Tuples are immutable
- **C)** Both are mutable
- **D)** Neither can be modified

*Hint: Try creating a list \`[1, 2]\` and mutating index 0!*`;
    }

    if (qLower.includes('falling behind') || qLower.includes('missed')) {
      return `### ⚙️ Don't Panic — Let's Adapt Your Roadmap!

You don't need to study 8 hours to catch up. 
Click the **⚙️ Adjust Plan** button on your dashboard to select **"I missed some days"**. 

I will automatically redistribute your remaining topics smoothly across your remaining timeline so your daily workload increases by only 15 minutes!`;
    }

    if (qLower.includes('shorten') || qLower.includes('fast track')) {
      return `### ⚡ Fast-Tracking Your Roadmap

If you want to complete **${skill}** in a shorter timeframe:
1. Open **⚙️ Adjust Plan** → Select **"I want to finish earlier"**.
2. We'll activate **Fast Track Mode ⚡**, focusing 100% on **🔴 Essential** topics and core portfolio projects while skipping non-critical theory.`;
    }

    if (qLower.includes('sql before pandas') || qLower.includes('order')) {
      return `### 🧠 Curriculum Order Recommendation

For a **${goal}** career path:
1. **Learn Python Fundamentals & Data Structures** first.
2. **Learn Pandas & NumPy** next to analyze tabular data in memory.
3. **Learn SQL** immediately after to query relational databases.

*Yes! Learning Pandas gives you great intuition for how tabular data works, making SQL JOINs and GROUP BY queries much easier to master!*`;
    }

    return `### 🤖 STUDYFLOW AI Mentor

I am tracking your **${skill}** journey towards becoming a **${goal}**.

- **Current Progress**: You're on track!
- **Today's Target**: ${pendingTask}

How can I help you master this topic or adjust your plan today?`;
  }

  /**
   * Generates custom project breakdown steps using Gemini or fallback
   */
  static async generateProjectPlan(project: RoadmapProject, apiKey?: string): Promise<ProjectStep[]> {
    const serverResult = await this.callServerApi('generateProjectPlan', { project });
    if (serverResult?.steps && Array.isArray(serverResult.steps)) return serverResult.steps;

    const ai = this.getClient(apiKey);
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `Generate a 5-step detailed implementation plan for this project: "${project.name}" (Difficulty: ${project.difficulty}, Tech Stack: ${project.suggestedTechStack.join(', ')}).
Return valid JSON array of objects:
[
  { "stepNumber": 1, "title": "...", "description": "...", "estimatedMinutes": 45 }
]`
        });
        const text = response.text || '';
        const match = text.match(/\[[\s\S]*\]/);
        if (match) return JSON.parse(match[0]);
      } catch (err) {
        console.warn('Gemini project plan generation failed:', err);
      }
    }

    return [
      { stepNumber: 1, title: 'Environment Setup & Dependencies', description: `Configure ${project.suggestedTechStack.join(', ')} environment and initialize repository.`, estimatedMinutes: 30 },
      { stepNumber: 2, title: 'Data Pipeline & Business Logic', description: `Build core modules for ${project.name}.`, estimatedMinutes: 90 },
      { stepNumber: 3, title: 'UI / Visualization / API Integration', description: `Implement features: ${project.featuresToBuild.slice(0, 2).join(' & ')}.`, estimatedMinutes: 120 },
      { stepNumber: 4, title: 'Validation & Error Handling', description: 'Test edge cases and refine error states.', estimatedMinutes: 60 },
      { stepNumber: 5, title: 'Portfolio Packaging & Deployment', description: 'Write README, document architecture, and host online.', estimatedMinutes: 45 }
    ];
  }
}
