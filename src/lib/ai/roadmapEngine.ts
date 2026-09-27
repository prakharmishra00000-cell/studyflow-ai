import { 
  UserInputs, UserRoadmap, RoadmapOverview, RoadmapMonth, 
  RoadmapModule, RoadmapTopic, RoadmapProject, RoadmapMilestone, 
  DailyPlanner, ActionableTask, TopicPriority, ProjectStep, ResourceItem,
  AIRoadmapRecommendation, RoadmapChangeType
} from '../types';

export class RoadmapEngine {

  /**
   * Generates a complete, personalized, living learning roadmap based on user inputs.
   */
  static generateRoadmap(inputs: UserInputs): UserRoadmap {
    const {
      skill,
      dailyHours = '2 hr',
      currentLevel = 'Beginner',
      goal = 'Become Job Ready',
      duration = '3 Months',
      learningMode = '💼 Job Ready'
    } = inputs;

    // Parse daily hours into number
    const dailyHoursNum = this.parseHours(dailyHours);
    const monthsNum = this.parseDurationMonths(duration);
    const totalDays = Math.round(monthsNum * 30);
    const estimatedTotalHours = Math.round(totalDays * dailyHoursNum);

    // Determine specific curriculum architecture
    const monthsData = this.buildCurriculum(skill, goal, duration, currentLevel, dailyHoursNum);
    const projectsData = this.buildProjects(skill, goal, currentLevel, monthsNum);
    const milestonesData = this.buildMilestones(skill, goal, monthsNum);
    const dailyPlanData = this.buildDailyPlan(monthsData[0]?.weeks[0]?.topics || [], dailyHoursNum, 1);

    const overview: RoadmapOverview = {
      skill,
      totalDuration: duration,
      dailyStudyTime: dailyHours,
      estimatedTotalHours,
      currentLevel,
      targetLevel: goal.includes('Job') || goal.includes('Analyst') || goal.includes('Developer') ? 'Job Ready / Professional' : 'Proficient Specialist',
      careerGoal: goal,
      modulesCount: monthsData.reduce((acc, m) => acc + m.weeks.length, 0),
      projectsCount: projectsData.length,
      milestonesCount: milestonesData.length,
      learningMode
    };

    return {
      id: `roadmap-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      overview,
      months: monthsData,
      projects: projectsData,
      milestones: milestonesData,
      dailyPlan: dailyPlanData,
      completedTopicIds: [],
      completedProjectIds: [],
      totalHoursStudied: 0,
      streakDays: 1,
      missedDaysCount: 0,
      replanningHistory: []
    };
  }

  /**
   * Helper to parse hours string e.g. "2 hr", "30 min", "1.5 hr"
   */
  static parseHours(hoursStr: string): number {
    if (!hoursStr) return 2;
    if (hoursStr.includes('30 min')) return 0.5;
    if (hoursStr.includes('1.5')) return 1.5;
    if (hoursStr.includes('1')) return 1;
    if (hoursStr.includes('2')) return 2;
    if (hoursStr.includes('3')) return 3;
    if (hoursStr.includes('4')) return 4;
    return 2;
  }

  /**
   * Helper to parse duration into number of months
   */
  static parseDurationMonths(durationStr: string): number {
    if (!durationStr) return 3;
    if (durationStr.includes('30 Days') || durationStr.includes('1 Month')) return 1;
    if (durationStr.includes('2 Months')) return 2;
    if (durationStr.includes('3 Months')) return 3;
    if (durationStr.includes('6 Months')) return 6;
    if (durationStr.includes('9 Months')) return 9;
    if (durationStr.includes('1 Year')) return 12;
    return 3;
  }

  /**
   * Builds custom, dynamic curriculum based on Skill + Goal + Duration + Level
   */
  private static buildCurriculum(
    skill: string, 
    goal: string, 
    duration: string, 
    level: string,
    dailyHours: number
  ): RoadmapMonth[] {
    const monthsCount = this.parseDurationMonths(duration);
    const normalizedSkill = skill.toLowerCase();
    const normalizedGoal = goal.toLowerCase();

    // Custom Python Career Paths
    if (normalizedSkill.includes('python')) {
      if (normalizedGoal.includes('analyst') || normalizedGoal.includes('data analyst')) {
        return this.buildPythonDataAnalystCurriculum(monthsCount, level);
      }
      if (normalizedGoal.includes('backend') || normalizedGoal.includes('developer')) {
        return this.buildPythonBackendCurriculum(monthsCount, level);
      }
      if (normalizedGoal.includes('automation') || normalizedGoal.includes('scripting')) {
        return this.buildPythonAutomationCurriculum(monthsCount, level);
      }
      if (normalizedGoal.includes('science') || normalizedGoal.includes('scientist')) {
        return this.buildPythonDataScienceCurriculum(monthsCount, level);
      }
      return this.buildPythonGeneralCurriculum(monthsCount, level);
    }

    // Generic Dynamic Generator for Web Dev, Data Science, Marketing, Excel, etc.
    return this.buildGenericCurriculum(skill, goal, monthsCount, level);
  }

  // PYTHON FOR DATA ANALYST
  private static buildPythonDataAnalystCurriculum(months: number, level: string): RoadmapMonth[] {
    const m1Topics: RoadmapTopic[] = [
      { id: 'pda-1', name: 'Python Fundamentals & Syntax', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Core', status: 'completed', mastery: 85, masteryLevel: 'Strong', description: 'Variables, primitive types, string formatting, arithmetic operators.', resources: this.createResources('Python Docs', 'https://docs.python.org/3/', 'Python syntax basics') },
      { id: 'pda-2', name: 'Control Flow & Functions', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Core', status: 'completed', mastery: 75, masteryLevel: 'Proficient', description: 'If-else branching, loops, functions, args and return values.', resources: this.createResources('RealPython Functions', 'https://realpython.com', 'Guide to clean Python functions') },
      { id: 'pda-3', name: 'Python Data Structures (Lists, Dicts, Sets)', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Core', status: 'in_progress', mastery: 55, masteryLevel: 'Developing', description: 'List indexing/slicing, dictionaries key-values, tuples, set operations.', resources: this.createResources('W3Schools Python Lists', 'https://w3schools.com', 'Interactive list operations') },
      { id: 'pda-4', name: 'Modules & Error Handling', priority: '🟡 Important', estimatedMinutes: 45, category: 'Core', status: 'pending', mastery: 30, masteryLevel: 'Beginner', description: 'Importing modules, try-except blocks, raising custom exceptions.', resources: this.createResources('Python Exception Guide', 'https://docs.python.org', 'Robust error handling') }
    ];

    const m2Topics: RoadmapTopic[] = [
      { id: 'pda-5', name: 'NumPy Vectorized Computing', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Data Analysis', status: 'pending', mastery: 20, masteryLevel: 'Awareness', description: 'ND-arrays, linear algebra broadcasting, element-wise math.', resources: this.createResources('NumPy Official Quickstart', 'https://numpy.org', 'Fast array computations') },
      { id: 'pda-6', name: 'Pandas DataFrames & Series', priority: '🔴 Essential', estimatedMinutes: 90, category: 'Data Analysis', status: 'pending', mastery: 15, masteryLevel: 'Awareness', description: 'Reading CSVs/JSONs, loc/iloc indexing, DataFrame manipulation.', resources: this.createResources('Pandas 10-Min Guide', 'https://pandas.pydata.org', 'Core data manipulation') },
      { id: 'pda-7', name: 'SQL Querying (SELECT, JOINs, Group By)', priority: '🔴 Essential', estimatedMinutes: 90, category: 'Database', status: 'pending', mastery: 10, masteryLevel: 'Awareness', description: 'Relational data query fundamentals, inner/left joins, aggregations.', resources: this.createResources('SQLZoo Practice', 'https://sqlzoo.net', 'Interactive SQL query exercises') },
      { id: 'pda-8', name: 'Statistics for Data Analysis', priority: '🟡 Important', estimatedMinutes: 60, category: 'Math', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Mean, median, variance, standard deviation, correlation, hypothesis testing.', resources: this.createResources('Khan Academy Statistics', 'https://khanacademy.org', 'Intuitive statistical reasoning') }
    ];

    const m3Topics: RoadmapTopic[] = [
      { id: 'pda-9', name: 'Data Cleaning & Wrangling', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Data Analysis', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Handling missing values, deduplication, type casting, regex extraction.', resources: this.createResources('Kaggle Data Cleaning', 'https://kaggle.com', 'Real-world noisy dataset cleaning') },
      { id: 'pda-10', name: 'Matplotlib & Seaborn Visualization', priority: '🟡 Important', estimatedMinutes: 60, category: 'Visualization', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Line graphs, bar charts, heatmaps, scatter plots, distributions.', resources: this.createResources('Seaborn Gallery', 'https://seaborn.pydata.org', 'Beautiful statistical plots') },
      { id: 'pda-11', name: 'Power BI / Tableau Dashboards', priority: '🟡 Important', estimatedMinutes: 90, category: 'BI Tools', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Building interactive visual dashboards, DAX metrics, publishing reports.', resources: this.createResources('Microsoft Power BI Learn', 'https://learn.microsoft.com', 'Enterprise BI dashboard creation') },
      { id: 'pda-12', name: 'Real-world Data Projects & Portfolio', priority: '🔴 Essential', estimatedMinutes: 120, category: 'Portfolio', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'End-to-end sales analytics dashboard, GitHub repo, portfolio case study.', resources: this.createResources('GitHub Portfolio Guide', 'https://github.com', 'Showcasing data projects effectively') }
    ];

    const m4_6Topics: RoadmapTopic[] = [
      { id: 'pda-13', name: 'Advanced SQL Window Functions', priority: '🔵 Optional', estimatedMinutes: 60, category: 'Database', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'RANK(), DENSE_RANK(), LAG(), LEAD(), partition by analytics.', resources: this.createResources('Mode SQL Tutorial', 'https://mode.com', 'Advanced analytical SQL') },
      { id: 'pda-14', name: 'Automated Excel & Report Generation', priority: '🔵 Optional', estimatedMinutes: 45, category: 'Automation', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'OpenPyXL, automated PDF report generation, email alerts.', resources: this.createResources('Automate the Boring Stuff', 'https://automatetheboringstuff.com', 'Excel automation with Python') },
      { id: 'pda-15', name: 'Resume Optimization & Mock Interviews', priority: '🟣 Advanced', estimatedMinutes: 60, category: 'Career', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'ATS-optimized Data Analyst resume, behavioral & technical SQL/Pandas interviews.', resources: this.createResources('InterviewBit SQL', 'https://interviewbit.com', 'Top Data Analyst interview questions') }
    ];

    const result: RoadmapMonth[] = [
      {
        monthNumber: 1,
        title: 'Month 1 — Foundations & Core Python',
        badgeColor: 'emerald',
        status: 'active',
        weeks: [
          { id: 'w1', monthNumber: 1, weekNumber: 1, title: 'Week 1 — Python Fundamentals', status: 'completed', topics: [m1Topics[0], m1Topics[1]] },
          { id: 'w2', monthNumber: 1, weekNumber: 2, title: 'Week 2 — Data Structures', status: 'active', topics: [m1Topics[2]] },
          { id: 'w3', monthNumber: 1, weekNumber: 3, title: 'Week 3 — Modules & File Handling', status: 'upcoming', topics: [m1Topics[3]] },
          { id: 'w4', monthNumber: 1, weekNumber: 4, title: 'Week 4 — Foundations Milestone Project', status: 'upcoming', topics: [
            { id: 'pda-4b', name: 'Python Foundations Portfolio Project', priority: '🔴 Essential', estimatedMinutes: 90, category: 'Portfolio', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Build an end-to-end CLI tool applying lists, dicts, and functions.', resources: this.createResources('Python Portfolio Project', 'https://github.com', 'CLI project tutorial') }
          ] }
        ]
      },
      {
        monthNumber: 2,
        title: 'Month 2 — Data Processing & SQL',
        badgeColor: 'amber',
        status: 'upcoming',
        weeks: [
          { id: 'w5', monthNumber: 2, weekNumber: 5, title: 'Week 5 — NumPy & Vectorized Computing', status: 'upcoming', topics: [m2Topics[0]] },
          { id: 'w6', monthNumber: 2, weekNumber: 6, title: 'Week 6 — Pandas Core DataFrames', status: 'upcoming', topics: [m2Topics[1]] },
          { id: 'w7', monthNumber: 2, weekNumber: 7, title: 'Week 7 — SQL Relational Databases', status: 'upcoming', topics: [m2Topics[2]] },
          { id: 'w8', monthNumber: 2, weekNumber: 8, title: 'Week 8 — Applied Business Statistics', status: 'upcoming', topics: [m2Topics[3]] }
        ]
      }
    ];

    if (months >= 3) {
      result.push({
        monthNumber: 3,
        title: 'Month 3 — Visualization, BI & Job Ready Portfolio',
        badgeColor: 'cyan',
        status: 'upcoming',
        weeks: [
          { id: 'w9', monthNumber: 3, weekNumber: 9, title: 'Week 9 — Data Wrangling & Cleaning', status: 'upcoming', topics: [m3Topics[0]] },
          { id: 'w10', monthNumber: 3, weekNumber: 10, title: 'Week 10 — Seaborn & Matplotlib Visualization', status: 'upcoming', topics: [m3Topics[1]] },
          { id: 'w11', monthNumber: 3, weekNumber: 11, title: 'Week 11 — Power BI Interactive Dashboards', status: 'upcoming', topics: [m3Topics[2]] },
          { id: 'w12', monthNumber: 3, weekNumber: 12, title: 'Week 12 — End-to-End Capstone & Interview Prep', status: 'upcoming', topics: [m3Topics[3]] }
        ]
      });
    }

    if (months >= 4) {
      result.push({
        monthNumber: 4,
        title: 'Month 4 — Advanced Analytics & ETL Automation',
        badgeColor: 'purple',
        status: 'upcoming',
        weeks: [
          { id: 'w13', monthNumber: 4, weekNumber: 13, title: 'Week 13 — SQL Window Functions & Aggregations', status: 'upcoming', topics: [m4_6Topics[0]] },
          { id: 'w14', monthNumber: 4, weekNumber: 14, title: 'Week 14 — Automated Excel & PDF Reporting', status: 'upcoming', topics: [m4_6Topics[1]] }
        ]
      });
    }

    if (months >= 5) {
      result.push({
        monthNumber: 5,
        title: 'Month 5 — Advanced Dashboarding & Cloud SQL',
        badgeColor: 'indigo',
        status: 'upcoming',
        weeks: [
          { id: 'w15', monthNumber: 5, weekNumber: 15, title: 'Week 15 — BigQuery & Cloud Databases', status: 'upcoming', topics: [m4_6Topics[2]] }
        ]
      });
    }

    if (months >= 6) {
      result.push({
        monthNumber: 6,
        title: 'Month 6 — Job Placement, Portfolio & Mock Interviews',
        badgeColor: 'emerald',
        status: 'upcoming',
        weeks: [
          { id: 'w16', monthNumber: 6, weekNumber: 16, title: 'Week 16 — Live Portfolio & Technical Interview Clearance', status: 'upcoming', topics: [
            { id: 'pda-16b', name: 'Technical Resume & Live Interview Clearance', priority: '🔴 Essential', estimatedMinutes: 90, category: 'Career', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'GitHub portfolio review, SQL live coding practice, resume ATS clearance.', resources: this.createResources('Data Analyst Interview Guide', 'https://interviewbit.com', 'Technical interview clearance') }
          ] }
        ]
      });
    }

    return result.slice(0, months);
  }

  // PYTHON FOR BACKEND DEVELOPER
  private static buildPythonBackendCurriculum(months: number, level: string): RoadmapMonth[] {
    const result: RoadmapMonth[] = [
      {
        monthNumber: 1,
        title: 'Month 1 — Python Core, OOP & Version Control',
        badgeColor: 'emerald',
        status: 'active',
        weeks: [
          { id: 'bw1', monthNumber: 1, weekNumber: 1, title: 'Week 1 — Python Core & Data Structures', status: 'completed', topics: [
            { id: 'pb-1', name: 'Python Core & Data Structures', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Core', status: 'completed', mastery: 80, masteryLevel: 'Strong', description: 'Lists, dicts, generators, comprehensions.', resources: this.createResources('Python Core Docs', 'https://docs.python.org', 'Official Python references') }
          ]},
          { id: 'bw2', monthNumber: 1, weekNumber: 2, title: 'Week 2 — Object-Oriented Programming (OOP)', status: 'active', topics: [
            { id: 'pb-2', name: 'OOP Classes & Inheritance', priority: '🔴 Essential', estimatedMinutes: 60, category: 'OOP', status: 'in_progress', mastery: 60, masteryLevel: 'Developing', description: 'Classes, dunder methods, inheritance, polymorphism.', resources: this.createResources('OOP Python Guide', 'https://realpython.com', 'Object-Oriented Design in Python') }
          ]},
          { id: 'bw3', monthNumber: 1, weekNumber: 3, title: 'Week 3 — Git & GitHub Workflow', status: 'upcoming', topics: [
            { id: 'pb-3', name: 'Git Branching & PR Workflows', priority: '🟡 Important', estimatedMinutes: 45, category: 'DevOps', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Commits, branches, rebase, merge conflicts, pull requests.', resources: this.createResources('Pro Git Book', 'https://git-scm.com', 'Essential version control') }
          ]}
        ]
      },
      {
        monthNumber: 2,
        title: 'Month 2 — REST APIs & Modern Frameworks (FastAPI/Django)',
        badgeColor: 'amber',
        status: 'upcoming',
        weeks: [
          { id: 'bw4', monthNumber: 2, weekNumber: 4, title: 'Week 4 — HTTP Protocol & REST Principles', status: 'upcoming', topics: [
            { id: 'pb-4', name: 'HTTP Verbs, Headers & Status Codes', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Networking', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'GET, POST, PUT, DELETE, JSON schemas, headers.', resources: this.createResources('MDN HTTP Guide', 'https://developer.mozilla.org', 'Web architecture standards') }
          ]},
          { id: 'bw5', monthNumber: 2, weekNumber: 5, title: 'Week 5 — FastAPI & Pydantic Validation', status: 'upcoming', topics: [
            { id: 'pb-5', name: 'FastAPI Microservice Development', priority: '🔴 Essential', estimatedMinutes: 90, category: 'Framework', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Async endpoints, path/query params, Pydantic type validation.', resources: this.createResources('FastAPI Official Docs', 'https://fastapi.tiangolo.com', 'Modern Python Web API') }
          ]}
        ]
      }
    ];

    if (months >= 3) {
      result.push({
        monthNumber: 3,
        title: 'Month 3 — Relational Databases, PostgreSQL & Authentication',
        badgeColor: 'cyan',
        status: 'upcoming',
        weeks: [
          { id: 'bw6', monthNumber: 3, weekNumber: 6, title: 'Week 6 — PostgreSQL & SQLAlchemy ORM', status: 'upcoming', topics: [
            { id: 'pb-6', name: 'PostgreSQL & SQLAlchemy ORM', priority: '🔴 Essential', estimatedMinutes: 90, category: 'Database', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Models, migrations with Alembic, foreign keys, indexing.', resources: this.createResources('SQLAlchemy Guide', 'https://sqlalchemy.org', 'Python Database ORM') }
          ]},
          { id: 'bw7', monthNumber: 3, weekNumber: 7, title: 'Week 7 — JWT Authentication & Security', status: 'upcoming', topics: [
            { id: 'pb-7', name: 'OAuth2 & JWT User Auth', priority: '🟡 Important', estimatedMinutes: 60, category: 'Security', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Password hashing (bcrypt), token expiration, middleware protection.', resources: this.createResources('JWT.io Security', 'https://jwt.io', 'Secure token authentication') }
          ]}
        ]
      });
    }

    return result;
  }

  // PYTHON FOR AUTOMATION
  private static buildPythonAutomationCurriculum(months: number, level: string): RoadmapMonth[] {
    return [
      {
        monthNumber: 1,
        title: 'Month 1 — Scripting, File I/O & Requests API',
        badgeColor: 'emerald',
        status: 'active',
        weeks: [
          { id: 'aw1', monthNumber: 1, weekNumber: 1, title: 'Week 1 — Python Scripting & OS Module', status: 'completed', topics: [
            { id: 'pa-1', name: 'File Handling & OS Automation', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Scripting', status: 'completed', mastery: 90, masteryLevel: 'Strong', description: 'Automating file renaming, folder organization, environment variables.', resources: this.createResources('Automate the Boring Stuff', 'https://automatetheboringstuff.com', 'Practical Python automation') }
          ]},
          { id: 'aw2', monthNumber: 1, weekNumber: 2, title: 'Week 2 — Web Requests & API Scraping', status: 'active', topics: [
            { id: 'pa-2', name: 'Requests & BeautifulSoup Scraping', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Scraping', status: 'in_progress', mastery: 50, masteryLevel: 'Developing', description: 'Fetching web pages, parsing HTML DOM, extracting text and tables.', resources: this.createResources('BS4 Documentation', 'https://www.crummy.com', 'HTML parsing with Python') }
          ]}
        ]
      },
      {
        monthNumber: 2,
        title: 'Month 2 — Web Automation (Selenium/Playwright) & Cron Scheduling',
        badgeColor: 'amber',
        status: 'upcoming',
        weeks: [
          { id: 'aw3', monthNumber: 2, weekNumber: 3, title: 'Week 3 — Playwright Headless Browser Control', status: 'upcoming', topics: [
            { id: 'pa-3', name: 'Playwright Browser Automation', priority: '🔴 Essential', estimatedMinutes: 90, category: 'Automation', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Clicking, typing, submitting forms, taking screenshots, handling captchas.', resources: this.createResources('Playwright Python Docs', 'https://playwright.dev/python', 'Modern browser automation') }
          ]}
        ]
      }
    ];
  }

  // PYTHON FOR DATA SCIENCE
  private static buildPythonDataScienceCurriculum(months: number, level: string): RoadmapMonth[] {
    return [
      {
        monthNumber: 1,
        title: 'Month 1 — Math, Linear Algebra & NumPy/Pandas',
        badgeColor: 'emerald',
        status: 'active',
        weeks: [
          { id: 'dsw1', monthNumber: 1, weekNumber: 1, title: 'Week 1 — Linear Algebra & Calculus Basics', status: 'completed', topics: [
            { id: 'pds-1', name: 'Vectors, Matrices & Derivatives', priority: '🔴 Essential', estimatedMinutes: 60, category: 'Math', status: 'completed', mastery: 75, masteryLevel: 'Proficient', description: 'Matrix multiplication, eigenvalues, gradient descent intuition.', resources: this.createResources('3Blue1Brown Linear Algebra', 'https://youtube.com', 'Visual math intuitions') }
          ]}
        ]
      },
      {
        monthNumber: 2,
        title: 'Month 2 — Machine Learning with Scikit-Learn',
        badgeColor: 'amber',
        status: 'upcoming',
        weeks: [
          { id: 'dsw2', monthNumber: 2, weekNumber: 2, title: 'Week 2 — Supervised Learning Algorithms', status: 'upcoming', topics: [
            { id: 'pds-2', name: 'Linear Regression & Decision Trees', priority: '🔴 Essential', estimatedMinutes: 90, category: 'ML', status: 'pending', mastery: 0, masteryLevel: 'Awareness', description: 'Model training, train/test split, cross-validation, RMSE.', resources: this.createResources('Scikit-Learn User Guide', 'https://scikit-learn.org', 'Standard ML framework') }
          ]}
        ]
      }
    ];
  }

  // GENERAL PYTHON
  private static buildPythonGeneralCurriculum(months: number, level: string): RoadmapMonth[] {
    return this.buildPythonDataAnalystCurriculum(months, level);
  }

  // GENERIC CURRICULUM GENERATOR FOR ANY OTHER SKILL (e.g. Web Dev, Marketing, Excel, SSC CGL)
  private static buildGenericCurriculum(skill: string, goal: string, months: number, level: string): RoadmapMonth[] {
    const result: RoadmapMonth[] = [];

    const monthConfigs = [
      { num: 1, title: `Month 1 — ${skill} Fundamentals & Core Syntax`, color: 'emerald' as const },
      { num: 2, title: `Month 2 — ${skill} Intermediate Concepts & Tools`, color: 'amber' as const },
      { num: 3, title: `Month 3 — ${goal} Practical Projects & Mastery`, color: 'cyan' as const },
      { num: 4, title: `Month 4 — Advanced ${skill} & System Architecture`, color: 'purple' as const },
      { num: 5, title: `Month 5 — Specialization & Optimization`, color: 'indigo' as const },
      { num: 6, title: `Month 6 — Career Placement & Portfolio`, color: 'emerald' as const }
    ];

    for (let m = 1; m <= Math.min(months, monthConfigs.length); m++) {
      const cfg = monthConfigs[m - 1];
      result.push({
        monthNumber: m,
        title: cfg.title,
        badgeColor: cfg.color,
        status: m === 1 ? 'active' : 'upcoming',
        weeks: [
          {
            id: `gen-w-${m}-1`,
            monthNumber: m,
            weekNumber: (m - 1) * 4 + 1,
            title: `Week ${(m - 1) * 4 + 1} — ${skill} Module ${m}.1`,
            status: m === 1 ? 'active' : 'upcoming',
            topics: [
              {
                id: `gen-top-${m}-1`,
                name: `${skill} Core Principles & Best Practices (${m}.1)`,
                priority: '🔴 Essential',
                estimatedMinutes: 60,
                category: 'Foundations',
                status: m === 1 ? 'in_progress' : 'pending',
                mastery: m === 1 ? 40 : 0,
                masteryLevel: m === 1 ? 'Developing' : 'Awareness',
                description: `Fundamental theoretical and practical concepts of ${skill}.`,
                resources: this.createResources(`${skill} Official Guide`, 'https://google.com', `Essential starter guide for ${skill}`)
              }
            ]
          },
          {
            id: `gen-w-${m}-2`,
            monthNumber: m,
            weekNumber: (m - 1) * 4 + 2,
            title: `Week ${(m - 1) * 4 + 2} — Applied Practice & ${skill} Workflows`,
            status: 'upcoming',
            topics: [
              {
                id: `gen-top-${m}-2`,
                name: `Hands-on ${skill} Implementation (${m}.2)`,
                priority: '🟡 Important',
                estimatedMinutes: 60,
                category: 'Practice',
                status: 'pending',
                mastery: 0,
                masteryLevel: 'Awareness',
                description: `Building real components using ${skill}.`,
                resources: this.createResources(`${skill} Practice Lab`, 'https://google.com', `Interactive exercises for ${skill}`)
              }
            ]
          }
        ]
      });
    }

    return result;
  }

  /**
   * Generates level-aware projects with prerequisites and suggested stack
   */
  private static buildProjects(skill: string, goal: string, level: string, months: number): RoadmapProject[] {
    const normSkill = skill.toLowerCase();

    if (normSkill.includes('python')) {
      const projects: RoadmapProject[] = [
        {
          id: 'proj-1',
          name: 'CLI Expense Tracker & Budget Calculator',
          difficulty: 'Beginner',
          skillsPracticed: ['Python Syntax', 'Data Structures', 'File I/O (JSON)', 'Error Handling'],
          estimatedTime: '4 - 6 Hours',
          prerequisites: ['Python Lists & Dicts', 'Functions', 'File Handling'],
          featuresToBuild: [
            'Add daily expenses with category and date',
            'Save transactions persistently into JSON file',
            'Generate monthly spending summaries and alert if budget limit is exceeded',
            'Export summary report to CSV file'
          ],
          suggestedTechStack: ['Python 3.11', 'JSON module', 'argparse / Rich CLI'],
          portfolioValue: 'Demonstrates clean procedural Python logic and robust file persistent storage.',
          extensionIdeas: ['Integrate SQLite database', 'Add Matplotlib CLI ASCII bar charts'],
          isCompleted: false
        },
        {
          id: 'proj-2',
          name: 'Live Weather Analytics Dashboard',
          difficulty: 'Intermediate',
          skillsPracticed: ['APIs (Requests)', 'Pandas DataFrame', 'Seaborn Graphs', 'Data Cleaning'],
          estimatedTime: '8 - 12 Hours',
          prerequisites: ['Requests API', 'Pandas DataFrames', 'Matplotlib/Seaborn'],
          featuresToBuild: [
            'Fetch 7-day weather forecast data from OpenWeather API',
            'Clean raw JSON into structured Pandas DataFrame',
            'Compute daily temperature anomalies, humidity correlations, and moving averages',
            'Plot interactive temperature trendline & export high-res PNG visual charts'
          ],
          suggestedTechStack: ['Python', 'Requests', 'Pandas', 'Seaborn', 'OpenWeatherMap API'],
          portfolioValue: 'Proves ability to consume external REST APIs, manipulate raw JSON data, and visualize insights.',
          extensionIdeas: ['Automate daily PDF report generation', 'Deploy as interactive Streamlit web application'],
          isCompleted: false
        },
        {
          id: 'proj-3',
          name: 'Sales Performance & Customer Churn BI System',
          difficulty: 'Advanced',
          skillsPracticed: ['SQL Complex Joins', 'Window Functions', 'Power BI / Tableau', 'Executive Storytelling'],
          estimatedTime: '15 - 25 Hours',
          prerequisites: ['SQL Joins & Group By', 'Power BI / Dashboarding', 'Data Analytics'],
          featuresToBuild: [
            'Design relational PostgreSQL database schema for e-commerce transactions',
            'Execute SQL queries computing Customer Lifetime Value (CLV), Monthly Recurring Revenue (MRR), and Churn Rate',
            'Connect SQL backend to Power BI interactive dashboard with dynamic slicers',
            'Write executive summary report highlighting revenue optimization recommendations'
          ],
          suggestedTechStack: ['PostgreSQL', 'SQLAlchemy / Pandas', 'Power BI Desktop', 'GitHub Markdown'],
          portfolioValue: 'High impact capstone project directly applicable to Data Analyst & Business Intelligence roles.',
          extensionIdeas: ['Add predictive ML model for churn probability using Scikit-Learn'],
          isCompleted: false
        }
      ];
      return projects;
    }

    // Generic projects for other skills
    return [
      {
        id: 'proj-gen-1',
        name: `${skill} Foundation Project`,
        difficulty: 'Beginner',
        skillsPracticed: [`${skill} Basics`, 'Problem Solving', 'Workflow Setup'],
        estimatedTime: '4 - 6 Hours',
        prerequisites: [`${skill} Fundamentals`],
        featuresToBuild: [`Core feature 1 of ${skill}`, `Data input and validation`, `Result visualization`],
        suggestedTechStack: [skill, 'Standard Tools'],
        portfolioValue: `Solid baseline proof of ${skill} understanding.`,
        extensionIdeas: ['Add user authentication', 'Optimize execution speed']
      },
      {
        id: 'proj-gen-2',
        name: `Professional ${skill} Capstone Platform`,
        difficulty: 'Advanced',
        skillsPracticed: [`Advanced ${skill}`, 'System Design', 'Production Readiness'],
        estimatedTime: '15 - 20 Hours',
        prerequisites: [`${skill} Intermediate Modules`],
        featuresToBuild: ['Complete end-to-end user flow', 'Automated testing and validation', 'Cloud or public deployment'],
        suggestedTechStack: [skill, 'Modern Frameworks', 'Git'],
        portfolioValue: `Production-grade project ready for resume & portfolio reviews.`,
        extensionIdeas: ['Add analytics telemetry', 'Scale to multi-user workloads']
      }
    ];
  }

  /**
   * Builds milestone checkpoints
   */
  private static buildMilestones(skill: string, goal: string, months: number): RoadmapMilestone[] {
    return [
      { id: 'm-1', monthNumber: 1, title: '🟢 Foundations Milestone', description: `Mastered fundamental syntax, core data structures, and baseline concepts of ${skill}.`, badge: '🌱 Syntax Wizard', isCompleted: true, status: 'achieved' },
      { id: 'm-2', monthNumber: 2, title: '🟡 Core Competency & Projects', description: `Built real-world intermediate projects and applied analytical tools independently.`, badge: '⚡ Systems Builder', isCompleted: false, status: 'in_progress' },
      { id: 'm-3', monthNumber: 3, title: '🔵 Job Ready & Portfolio Master', description: `Completed full capstone portfolio, interview prep, and career readiness check.`, badge: '🏆 Job Ready Professional', isCompleted: false, status: 'upcoming' }
    ];
  }

  /**
   * Converts roadmap topics into actionable daily tasks for Today view
   */
  private static buildDailyPlan(topics: RoadmapTopic[], availableHours: number, dayNumber: number): DailyPlanner {
    const dateStr = new Date().toISOString().split('T')[0];
    const targetTopic = topics[0] || { id: 'top-default', name: 'Python Lists & Functions', priority: '🔴 Essential', category: 'Core' };

    const tasks: ActionableTask[] = [
      {
        id: `dt-1-${Date.now()}`,
        topicId: targetTopic.id,
        timeSlot: '09:00 - 09:30',
        icon: '📚',
        title: `Learn ${targetTopic.name}`,
        category: 'Concept Study',
        estimatedMinutes: 30,
        status: 'completed',
        priority: targetTopic.priority || '🔴 Essential'
      },
      {
        id: `dt-2-${Date.now()}`,
        topicId: targetTopic.id,
        timeSlot: '09:30 - 10:00',
        icon: '🎥',
        title: `Watch Recommended Video & Read Documentation`,
        category: 'Guided Material',
        estimatedMinutes: 30,
        status: 'pending',
        priority: '🟡 Important'
      },
      {
        id: `dt-3-${Date.now()}`,
        topicId: targetTopic.id,
        timeSlot: '10:00 - 10:30',
        icon: '💻',
        title: `Practice 5 Hands-on Coding Problems`,
        category: 'Active Practice',
        estimatedMinutes: 30,
        status: 'pending',
        priority: '🔴 Essential'
      },
      {
        id: `dt-4-${Date.now()}`,
        topicId: targetTopic.id,
        timeSlot: '10:30 - 11:00',
        icon: '🧠',
        title: `Complete AI-Generated Quiz & Diagnostic Challenge`,
        category: 'Self-Assessment',
        estimatedMinutes: 30,
        status: 'pending',
        priority: '🔵 Optional'
      }
    ];

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const progressPercentage = Math.round((completedCount / tasks.length) * 100);

    return {
      dayNumber,
      date: dateStr,
      availableHours: `${availableHours} Hours`,
      progressPercentage,
      tasks
    };
  }

  /**
   * Helper to create 1 Primary, 1 Practice, 1 Reference resource per topic
   */
  private static createResources(title: string, url: string, description: string): ResourceItem[] {
    return [
      {
        id: `r-1-${Date.now()}`,
        title: `${title} — Core Concept Guide`,
        url: url.startsWith('http') ? url : `https://${url}`,
        category: '📚 Documentation',
        type: 'Primary',
        whyThisResource: `Essential foundational reading selected because it explains ${description} with clarity.`
      },
      {
        id: `r-2-${Date.now()}`,
        title: `${title} — Hands-on Practice Problems`,
        url: 'https://leetcode.com',
        category: '🧪 Practice',
        type: 'Practice',
        whyThisResource: 'Includes 5 curated interactive problems to reinforce muscle memory.'
      },
      {
        id: `r-3-${Date.now()}`,
        title: `${title} — Quick Reference Sheet`,
        url: 'https://cheatsheet.com',
        category: '📝 Articles',
        type: 'Reference',
        whyThisResource: 'Fast cheat sheet reference for syntax, edge cases, and standard patterns.'
      }
    ];
  }

  /**
   * Generates a structured AIRoadmapRecommendation object for Section 30 User Control.
   */
  static generateRecommendation(
    currentRoadmap: UserRoadmap,
    adjustment: {
      type: RoadmapChangeType;
      value?: any;
    }
  ): AIRoadmapRecommendation {
    const { newRoadmap, recommendation, beforeSummary, afterSummary } = this.replanRoadmap(currentRoadmap, adjustment);

    let title = 'AI Roadmap Adaptation Recommendation';
    let reasons: string[] = [];
    let removedModules: string[] = [];
    let addedModules: string[] = [];
    let compressedModules: string[] = [];

    switch (adjustment.type) {
      case 'less_time':
        title = `Schedule Adaptation: Time Reduced to ${adjustment.value || '1 hr'}/day`;
        reasons = [
          'Available daily study time decreased.',
          'Prioritizes Essential 🔴 topics to prevent burnout and keep progress steady.',
          'Postpones non-critical optional modules while maintaining core career milestones.'
        ];
        removedModules = ['Advanced SQL Window Functions', 'Automated Excel Reporting'];
        compressedModules = ['Data Cleaning (Combined with Core Pandas)'];
        break;

      case 'more_time':
        title = `Schedule Expansion: Time Increased to ${adjustment.value || '3 hr'}/day`;
        reasons = [
          'Increased daily study time allows deeper mastery.',
          'Adds hands-on capstone coding practice blocks and extra exercises.',
          'Accelerates milestone completion date by 2+ weeks.'
        ];
        addedModules = ['BigQuery Cloud SQL', 'System Design & Portfolio Optimization'];
        break;

      case 'missed_days':
        title = `Schedule Rebalance: Missed ${adjustment.value || 3} Days`;
        reasons = [
          'Rebalances remaining workload without forcing an unmanageable 8-hour catchup day.',
          'Slightly adjusts daily time buffer so you reach your goal right on schedule.',
          'Your schedule changed. Let\'s adapt.'
        ];
        compressedModules = [`Redistributed ${adjustment.value || 3} missed days across remaining schedule`];
        break;

      case 'change_goal':
        title = `Goal Transformation: ${currentRoadmap.overview.careerGoal} ➔ ${adjustment.value || 'Data Scientist'}`;
        reasons = [
          `Transforms remaining future modules to focus on ${adjustment.value || 'Data Science'}, Machine Learning & Advanced Analytics.`,
          `Preserves your completed Python syntax and programming fundamentals.`,
          `Builds portfolio capstone projects targeted specifically at ${adjustment.value || 'Data Science'} roles.`
        ];
        addedModules = ['Scikit-Learn Machine Learning', 'Deep Learning & Neural Networks', 'MLOps & Model Deployment'];
        removedModules = ['Basic Excel Automation', 'Simple BI Dashboards'];
        break;

      case 'change_duration':
      case 'finish_earlier':
        title = `Timeline Compression: ${currentRoadmap.overview.totalDuration} ➔ ${adjustment.value || '3 Months'}`;
        reasons = [
          `Evaluated feasibility: Switches roadmap to Fast Track Mode ⚡.`,
          `Prioritizes high-yield essential modules for fast job readiness.`,
          `Compresses theory lectures into project-first active practice.`
        ];
        removedModules = ['Optional Elective Modules', 'Secondary Automation Topics'];
        compressedModules = ['Months 4-6 compressed into accelerated Month 3 Capstone Sprint'];
        break;

      default:
        reasons = ['Optimizes pacing based on current retention and speed.'];
        break;
    }

    return {
      id: `rec-${Date.now()}`,
      changeType: adjustment.type,
      title,
      recommendationText: recommendation,
      reasons,
      beforeSummary,
      afterSummary,
      removedModules,
      addedModules,
      compressedModules,
      proposedRoadmap: newRoadmap
    };
  }

  /**
   * CORE AI REPLANNING ENGINE
   * Intelligently recalculates remaining workload without overloading the user.
   */
  static replanRoadmap(
    currentRoadmap: UserRoadmap,
    adjustment: {
      type: 'missed_days' | 'more_time' | 'less_time' | 'finish_earlier' | 'need_practice' | 'change_goal' | 'change_duration';
      value?: any;
    }
  ): {
    newRoadmap: UserRoadmap;
    recommendation: string;
    beforeSummary: string;
    afterSummary: string;
  } {
    const updatedRoadmap = JSON.parse(JSON.stringify(currentRoadmap)) as UserRoadmap;
    let recommendation = '';
    let beforeSummary = '';
    let afterSummary = '';

    const currentHours = this.parseHours(updatedRoadmap.overview.dailyStudyTime);
    const currentMonths = this.parseDurationMonths(updatedRoadmap.overview.totalDuration);

    switch (adjustment.type) {
      case 'missed_days': {
        const missedDays = adjustment.value || 3;
        updatedRoadmap.missedDaysCount += missedDays;
        
        const remainingDays = Math.max(1, Math.round(currentMonths * 30 - 15));
        const estimatedRemainingHours = 54; // approximate
        const newDailyMinutes = Math.min(240, Math.round((estimatedRemainingHours / remainingDays) * 60));
        const newDailyHoursStr = `${Math.floor(newDailyMinutes / 60)} hrs ${newDailyMinutes % 60} min`;

        beforeSummary = `Original Plan: ${updatedRoadmap.overview.dailyStudyTime}/day (${missedDays} missed days pending)`;
        afterSummary = `Optimized Plan: ${newDailyHoursStr}/day redistributed across remaining ${remainingDays} days`;
        recommendation = `You missed ${missedDays} days. I've recalculated your remaining 54 hours across ${remainingDays} days. Instead of forcing an impossible 8-hour catchup day, your daily workload increases slightly from ${updatedRoadmap.overview.dailyStudyTime} to ${newDailyHoursStr}/day so you finish right on schedule!`;
        
        updatedRoadmap.overview.dailyStudyTime = `${Math.floor(newDailyMinutes / 60)}.${Math.round((newDailyMinutes % 60)/6)} hrs`;
        break;
      }

      case 'more_time': {
        const newHours = adjustment.value || '3 hr';
        const newHoursNum = this.parseHours(newHours);
        
        beforeSummary = `Current: ${updatedRoadmap.overview.dailyStudyTime}/day`;
        afterSummary = `Updated: ${newHours}/day (Added deep practice & project blocks)`;
        recommendation = `Great news! You now have 1 additional hour each day (${newHours} total). I've redistributed your remaining roadmap to include additional hands-on coding practice, deeper project tasks, and earlier milestone completion.`;

        updatedRoadmap.overview.dailyStudyTime = newHours;
        updatedRoadmap.overview.estimatedTotalHours = Math.round(currentMonths * 30 * newHoursNum);
        
        // Boost priorities or add practice tasks
        updatedRoadmap.months.forEach(m => {
          m.weeks.forEach(w => {
            w.topics.forEach(t => {
              if (t.priority === '🔵 Optional') t.priority = '🟡 Important';
            });
          });
        });
        break;
      }

      case 'less_time': {
        const newHours = adjustment.value || '1 hr';
        const newHoursNum = this.parseHours(newHours);

        beforeSummary = `Current: ${updatedRoadmap.overview.dailyStudyTime}/day`;
        afterSummary = `Updated: ${newHours}/day (Pruned optional content; focused on Essentials 🔴)`;
        recommendation = `Your available study time decreased to ${newHours}/day. I've automatically prioritized core Essential (🔴) topics, postponed non-critical Optional (🔵) modules, and streamlined your project scope to ensure you reach your goal without burnout.`;

        updatedRoadmap.overview.dailyStudyTime = newHours;
        updatedRoadmap.overview.estimatedTotalHours = Math.round(currentMonths * 30 * newHoursNum);

        // Intelligently prune/postpone optional and advanced topics
        updatedRoadmap.months.forEach(m => {
          m.weeks.forEach(w => {
            w.topics = w.topics.filter(t => t.priority === '🔴 Essential' || t.priority === '🟡 Important');
          });
        });
        break;
      }

      case 'finish_earlier': {
        const newDuration = adjustment.value || '2 Months';
        
        beforeSummary = `Original Timeline: ${updatedRoadmap.overview.totalDuration}`;
        afterSummary = `Accelerated Timeline: ${newDuration} (Fast Track Mode ⚡)`;
        recommendation = `I've restructured your roadmap for ${newDuration}. Content has been compressed into Fast Track Mode ⚡, focusing on high-yield essential skills and portfolio projects while skipping redundant theory.`;

        updatedRoadmap.overview.totalDuration = newDuration;
        updatedRoadmap.overview.learningMode = '⚡ Fast Track';
        updatedRoadmap.months = updatedRoadmap.months.slice(0, this.parseDurationMonths(newDuration));
        break;
      }

      case 'change_goal': {
        const newGoal = adjustment.value || 'Data Scientist';
        
        beforeSummary = `Previous Goal: ${updatedRoadmap.overview.careerGoal}`;
        afterSummary = `New Goal: ${newGoal} (Regenerated future curriculum path)`;
        recommendation = `Goal updated to "${newGoal}". I've transformed your remaining future modules to focus on math, machine learning models, and data science capstone projects while preserving your completed Python fundamentals.`;

        updatedRoadmap.overview.careerGoal = newGoal;
        // Regenerate curriculum for new goal
        const newMonths = this.buildCurriculum(updatedRoadmap.overview.skill, newGoal, updatedRoadmap.overview.totalDuration, updatedRoadmap.overview.currentLevel, currentHours);
        updatedRoadmap.months = newMonths;
        break;
      }

      case 'need_practice': {
        const topicName = adjustment.value || 'Pandas DataFrames';
        
        beforeSummary = `Standard pacing`;
        afterSummary = `Added 20 min active revision & targeted practice tasks for ${topicName}`;
        recommendation = `Got it! I've scheduled 20 minutes of active revision and 3 extra practice problems for "${topicName}" into today's schedule before moving on to new topics.`;

        updatedRoadmap.dailyPlan.tasks.unshift({
          id: `rev-${Date.now()}`,
          timeSlot: '08:40 - 09:00',
          icon: '🧠',
          title: `Active Revision: ${topicName}`,
          category: 'Targeted Practice',
          estimatedMinutes: 20,
          status: 'pending',
          priority: '🔴 Essential'
        });
        break;
      }

      default:
        recommendation = 'Plan adjusted successfully based on your preferences.';
        beforeSummary = 'Previous plan';
        afterSummary = 'Updated plan';
        break;
    }

    // Save history record
    updatedRoadmap.replanningHistory.unshift({
      changedAt: new Date().toISOString(),
      reason: adjustment.type,
      beforeSummary,
      afterSummary
    });

    updatedRoadmap.updatedAt = new Date().toISOString();

    return {
      newRoadmap: updatedRoadmap,
      recommendation,
      beforeSummary,
      afterSummary
    };
  }

  /**
   * Breaks down a project into step-by-step actionable plans
   */
  static generateProjectPlan(project: RoadmapProject): ProjectStep[] {
    if (project.steps && project.steps.length > 0) return project.steps;

    return [
      {
        stepNumber: 1,
        title: 'Project Setup & Environment Initialization',
        description: 'Initialize Git repository, set up virtual environment (venv), install core dependencies, and configure directory structure.',
        estimatedMinutes: 45
      },
      {
        stepNumber: 2,
        title: 'Core Data Schema & Module Logic',
        description: `Implement fundamental classes, data parsing, and business logic for ${project.name}.`,
        estimatedMinutes: 90
      },
      {
        stepNumber: 3,
        title: 'Feature Implementation & Integration',
        description: `Build features: ${project.featuresToBuild.slice(0, 2).join(', ')}.`,
        estimatedMinutes: 120
      },
      {
        stepNumber: 4,
        title: 'User Interface / CLI / Dashboard Binding',
        description: 'Connect internal Python logic to output interface, chart visualizer, or interactive UI components.',
        estimatedMinutes: 90
      },
      {
        stepNumber: 5,
        title: 'Testing, Refactoring & Portfolio Documentation',
        description: 'Write unit tests, handle edge cases, write professional README.md with screenshots and architecture diagram.',
        estimatedMinutes: 60
      }
    ];
  }
}
