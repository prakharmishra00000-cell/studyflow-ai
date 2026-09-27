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
    if (durationStr.includes('2 Month')) return 2;
    if (durationStr.includes('3 Month')) return 3;
    if (durationStr.includes('6 Month')) return 6;
    if (durationStr.includes('9 Month')) return 9;
    if (durationStr.includes('1 Year') || durationStr.includes('12 Month')) return 12;
    const match = durationStr.match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
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

  // PYTHON FOR DATA ANALYST (Full 1 to 12 months, 4 weeks per month)
  private static buildPythonDataAnalystCurriculum(months: number, level: string): RoadmapMonth[] {
    const monthDefinitions = [
      {
        monthNumber: 1,
        title: 'Month 1 — Foundations & Core Python Syntax',
        badgeColor: 'emerald' as const,
        weeks: [
          { title: 'Week 1 — Python Fundamentals & Syntax', topicName: 'Variables, Data Types & Operators', desc: 'Variables, primitive types, string formatting, arithmetic operators.', priority: '🔴 Essential' as TopicPriority, cat: 'Core' },
          { title: 'Week 2 — Control Flow & Functions', topicName: 'Branching, Loops & Modular Functions', desc: 'If-else branching, for/while loops, function definitions & return values.', priority: '🔴 Essential' as TopicPriority, cat: 'Core' },
          { title: 'Week 3 — Data Structures (Lists, Dicts, Sets)', topicName: 'List Slicing, Dictionaries & Tuples', desc: 'List indexing, dictionary key-values, tuple immutability, set operations.', priority: '🔴 Essential' as TopicPriority, cat: 'Core' },
          { title: 'Week 4 — Modules & Python CLI Capstone', topicName: 'Modules, File I/O & CLI Project', desc: 'Importing packages, try-except error handling, building persistent CLI tool.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 2,
        title: 'Month 2 — Data Processing & Relational SQL',
        badgeColor: 'amber' as const,
        weeks: [
          { title: 'Week 5 — NumPy & Vectorized Computation', topicName: 'NumPy Arrays & Linear Algebra', desc: 'ND-arrays, vectorized math operations, broadcasting, masking.', priority: '🔴 Essential' as TopicPriority, cat: 'Data Analysis' },
          { title: 'Week 6 — Pandas Core DataFrames', topicName: 'Pandas DataFrames, loc/iloc & Merging', desc: 'Reading CSV/JSON files, loc/iloc indexing, merging & concatenating DataFrames.', priority: '🔴 Essential' as TopicPriority, cat: 'Data Analysis' },
          { title: 'Week 7 — SQL Relational Databases', topicName: 'SQL SELECT, JOINs & Group By', desc: 'Relational data query fundamentals, inner/left joins, aggregations & GROUP BY.', priority: '🔴 Essential' as TopicPriority, cat: 'Database' },
          { title: 'Week 8 — Applied Business Statistics', topicName: 'Descriptive & Inferential Statistics', desc: 'Mean, median, variance, standard deviation, correlation matrices, hypothesis testing.', priority: '🟡 Important' as TopicPriority, cat: 'Math' }
        ]
      },
      {
        monthNumber: 3,
        title: 'Month 3 — Data Visualization, BI & Portfolio Capstone',
        badgeColor: 'cyan' as const,
        weeks: [
          { title: 'Week 9 — Data Cleaning & Wrangling', topicName: 'Missing Data Imputation & Outlier Removal', desc: 'Handling missing values, deduplication, regex extraction, data type casting.', priority: '🔴 Essential' as TopicPriority, cat: 'Data Analysis' },
          { title: 'Week 10 — Seaborn & Matplotlib Visualization', topicName: 'Statistical Plots & Visual Storytelling', desc: 'Line graphs, bar charts, heatmaps, distribution plots, customized themes.', priority: '🟡 Important' as TopicPriority, cat: 'Visualization' },
          { title: 'Week 11 — Power BI / Tableau Dashboards', topicName: 'Interactive Dashboards & DAX Metrics', desc: 'Building interactive visual dashboards, calculated columns, publishing reports.', priority: '🟡 Important' as TopicPriority, cat: 'BI Tools' },
          { title: 'Week 12 — End-to-End Sales Analytics Capstone', topicName: 'Live Portfolio Capstone & Case Study', desc: 'End-to-end e-commerce analytics dashboard, GitHub repo, executive report.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 4,
        title: 'Month 4 — Advanced SQL, Window Functions & Automation',
        badgeColor: 'purple' as const,
        weeks: [
          { title: 'Week 13 — SQL Window Functions', topicName: 'RANK(), DENSE_RANK() & LAG/LEAD', desc: 'Analytical SQL queries, partition by clause, running totals, cohort analytics.', priority: '🔴 Essential' as TopicPriority, cat: 'Database' },
          { title: 'Week 14 — Automated Excel & PDF Reporting', topicName: 'OpenPyXL & Automated Report Generation', desc: 'Python scripts for automated Excel formatting, PDF report generation, email alerts.', priority: '🟡 Important' as TopicPriority, cat: 'Automation' },
          { title: 'Week 15 — Web Scraping for Data Extraction', topicName: 'BeautifulSoup & Requests Pipeline', desc: 'Extracting data from web pages, parsing DOM structures, automated scheduling.', priority: '🔵 Optional' as TopicPriority, cat: 'Automation' },
          { title: 'Week 16 — Advanced ETL Pipeline Design', topicName: 'Data Ingestion & Cleaning Workflows', desc: 'Designing modular data processing pipelines from raw logs to clean warehouse tables.', priority: '🔴 Essential' as TopicPriority, cat: 'Data Engineering' }
        ]
      },
      {
        monthNumber: 5,
        title: 'Month 5 — Cloud Data Warehousing & Big Data Tools',
        badgeColor: 'indigo' as const,
        weeks: [
          { title: 'Week 17 — Google BigQuery & Cloud Databases', topicName: 'BigQuery SQL & Cloud Warehousing', desc: 'Querying massive datasets in BigQuery, partitioning, clustering tables.', priority: '🔴 Essential' as TopicPriority, cat: 'Cloud SQL' },
          { title: 'Week 18 — Snowflake Warehousing Architecture', topicName: 'Snowflake Virtual Warehouses & Staging', desc: 'Snowflake staging, COPY INTO operations, zero-copy cloning, RBAC security.', priority: '🟡 Important' as TopicPriority, cat: 'Cloud SQL' },
          { title: 'Week 19 — PySpark Large Dataset Processing', topicName: 'PySpark RDDs & DataFrames', desc: 'Distributed computing fundamentals, Spark DataFrames, processing gigabyte datasets.', priority: '🟣 Advanced' as TopicPriority, cat: 'Big Data' },
          { title: 'Week 20 — Automated Workflow Orchestration', topicName: 'Airflow DAG Scheduling Basics', desc: 'Building automated data pipeline DAGs, task dependencies, failure alerts.', priority: '🟡 Important' as TopicPriority, cat: 'Data Engineering' }
        ]
      },
      {
        monthNumber: 6,
        title: 'Month 6 — Predictive Analytics, Machine Learning & Career Clearance',
        badgeColor: 'emerald' as const,
        weeks: [
          { title: 'Week 21 — Exploratory Data Analysis (EDA)', topicName: 'Advanced Feature Analysis & Insights', desc: 'Multivariate EDA, correlation analysis, anomaly detection, business insights.', priority: '🔴 Essential' as TopicPriority, cat: 'Data Analysis' },
          { title: 'Week 22 — Predictive Modeling with Scikit-Learn', topicName: 'Linear & Logistic Regression Models', desc: 'Scikit-Learn model training, train/test splitting, confusion matrix, ROC-AUC.', priority: '🔴 Essential' as TopicPriority, cat: 'Machine Learning' },
          { title: 'Week 23 — Live Portfolio Web Platform', topicName: 'GitHub Portfolio & Case Study Publication', desc: 'Deploying interactive portfolio web dashboard using Streamlit/GitHub Pages.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' },
          { title: 'Week 24 — Technical Resume & Mock Interview Clearance', topicName: 'ATS Resume Clearance & Live Coding Practice', desc: 'Behavioral & technical SQL/Pandas live coding interviews, resume optimization.', priority: '🔴 Essential' as TopicPriority, cat: 'Career' }
        ]
      },
      {
        monthNumber: 7,
        title: 'Month 7 — Statistical Inference & A/B Experimentation',
        badgeColor: 'amber' as const,
        weeks: [
          { title: 'Week 25 — Hypothesis Testing & Confidence Intervals', topicName: 'Z-test, T-test & Chi-Square Analysis', desc: 'P-values, null hypothesis testing, statistical significance, sample sizes.', priority: '🔴 Essential' as TopicPriority, cat: 'Statistics' },
          { title: 'Week 26 — A/B Testing Experiment Design', topicName: 'A/B Test Design & Conversion Analysis', desc: 'Randomization, minimum detectable effect, tracking conversion metrics.', priority: '🔴 Essential' as TopicPriority, cat: 'Experimentation' },
          { title: 'Week 27 — Time Series Analysis & Forecasting', topicName: 'ARIMA, Prophet & Moving Averages', desc: 'Stationarity, seasonality decomposition, predicting future sales trends.', priority: '🟡 Important' as TopicPriority, cat: 'Analytics' },
          { title: 'Week 28 — Product Analytics & Funnel Analysis', topicName: 'Cohort Analysis & Retention Rates', desc: 'User retention curves, churn rate calculation, conversion funnels.', priority: '🟡 Important' as TopicPriority, cat: 'Product Analytics' }
        ]
      },
      {
        monthNumber: 8,
        title: 'Month 8 — Advanced Enterprise Dashboards & Governance',
        badgeColor: 'cyan' as const,
        weeks: [
          { title: 'Week 29 — Advanced DAX & Power BI Modeling', topicName: 'Complex DAX Calculations & Star Schema', desc: 'CALCULATE(), SUMX(), time intelligence functions, star-schema data modeling.', priority: '🔴 Essential' as TopicPriority, cat: 'BI Tools' },
          { title: 'Week 30 — Tableau Calculations & LOD Expressions', topicName: 'Tableau Level of Detail (LOD) Expressions', desc: 'FIXED, INCLUDE, EXCLUDE calculations, parameter actions, executive design.', priority: '🟡 Important' as TopicPriority, cat: 'BI Tools' },
          { title: 'Week 31 — Data Quality Auditing & Governance', topicName: 'Data Validation Rules & Integrity Checks', desc: 'Automated data quality checks, schema drift validation, documentation standards.', priority: '🟡 Important' as TopicPriority, cat: 'Governance' },
          { title: 'Week 32 — Enterprise Executive Dashboard Capstone', topicName: 'C-Suite Executive KPI Dashboard', desc: 'Designing multi-tab enterprise dashboard with dynamic filtering and security.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 9,
        title: 'Month 9 — Machine Learning for BI & Customer Analytics',
        badgeColor: 'purple' as const,
        weeks: [
          { title: 'Week 33 — Customer Segmentation & K-Means Clustering', topicName: 'RFM Modeling & K-Means Clustering', desc: 'Recency, Frequency, Monetary value scoring, unsupervised clustering.', priority: '🔴 Essential' as TopicPriority, cat: 'Machine Learning' },
          { title: 'Week 34 — Customer Churn Prediction Models', topicName: 'Decision Trees & Random Forests', desc: 'Predicting user churn probability, feature importance evaluation.', priority: '🔴 Essential' as TopicPriority, cat: 'Machine Learning' },
          { title: 'Week 35 — Market Basket Analysis & Association Rules', topicName: 'Apriori Algorithm & Cross-sell Insights', desc: 'Association rules, support, confidence, lift metrics for e-commerce.', priority: '🔵 Optional' as TopicPriority, cat: 'Analytics' },
          { title: 'Week 36 — Model Diagnostics & Business Valuation', topicName: 'Evaluating ML ROI & Model Deployment', desc: 'Translating model accuracy into financial revenue impact for leadership.', priority: '🟣 Advanced' as TopicPriority, cat: 'Strategy' }
        ]
      },
      {
        monthNumber: 10,
        title: 'Month 10 — Real-Time Streaming Analytics & Web Apps',
        badgeColor: 'indigo' as const,
        weeks: [
          { title: 'Week 37 — Real-Time Data Streaming Concepts', topicName: 'API Polling & Webhook Integration', desc: 'Consuming real-time stock/crypto or web event streams into DataFrames.', priority: '🟡 Important' as TopicPriority, cat: 'Streaming' },
          { title: 'Week 38 — REST API Integration & Microservices', topicName: 'Building Fast Data Extraction APIs', desc: 'Exposing query endpoints using FastAPI for real-time analytics consuming.', priority: '🟡 Important' as TopicPriority, cat: 'API Development' },
          { title: 'Week 39 — Streamlit Web Dashboard Development', topicName: 'Interactive Web Apps with Streamlit', desc: 'Building custom Python web applications with widgets, plots, and real-time refresh.', priority: '🔴 Essential' as TopicPriority, cat: 'Web Apps' },
          { title: 'Week 40 — Live Analytics Platform Capstone', topicName: 'Real-time Analytics Web Platform', desc: 'Building full-stack interactive analytics application deployed to cloud.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 11,
        title: 'Month 11 — Production Data Engineering & Infrastructure',
        badgeColor: 'emerald' as const,
        weeks: [
          { title: 'Week 41 — Docker Containers for Data Applications', topicName: 'Dockerization of Analytics Pipelines', desc: 'Containerizing Python data scripts, writing Dockerfiles and compose setups.', priority: '🟡 Important' as TopicPriority, cat: 'DevOps' },
          { title: 'Week 42 — CI/CD for Data Pipelines', topicName: 'GitHub Actions for Automated Testing', desc: 'Automating pipeline execution and unit testing on code commits.', priority: '🟡 Important' as TopicPriority, cat: 'DevOps' },
          { title: 'Week 43 — Cloud Infrastructure (AWS S3 / GCP Cloud Storage)', topicName: 'Cloud Data Lakes & Blob Storage', desc: 'Storing unstructured data in cloud buckets, querying S3 via PySpark/DuckDB.', priority: '🔴 Essential' as TopicPriority, cat: 'Cloud' },
          { title: 'Week 44 — Production Pipeline Load & Stress Testing', topicName: 'Benchmark Testing & Performance Tuning', desc: 'Optimizing SQL query execution plans, memory profiling Pandas operations.', priority: '🟣 Advanced' as TopicPriority, cat: 'Engineering' }
        ]
      },
      {
        monthNumber: 12,
        title: 'Month 12 — Principal Analyst Mastery & Career Placement',
        badgeColor: 'cyan' as const,
        weeks: [
          { title: 'Week 45 — Executive KPI Strategy & Storytelling', topicName: 'Executive Communication & Presentation', desc: 'Structuring executive slide decks, presenting data insights to non-technical stakeholders.', priority: '🔴 Essential' as TopicPriority, cat: 'Leadership' },
          { title: 'Week 46 — Data Team Governance & Ethics', topicName: 'Data Privacy, GDPR & Compliance', desc: 'Handling PII data securely, compliance regulations, ethical AI considerations.', priority: '🟡 Important' as TopicPriority, cat: 'Governance' },
          { title: 'Week 47 — Master Technical Portfolio Review', topicName: 'Complete Portfolio Audit & Polish', desc: 'Finalizing 3 major capstone projects, open-source contribution reviews.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' },
          { title: 'Week 48 — Final Career Placement & Salary Negotiation', topicName: 'Job Search Strategy & Offer Clearance', desc: 'Targeted company outreach, salary negotiation tactics, final interview clearance.', priority: '🔴 Essential' as TopicPriority, cat: 'Career Placement' }
        ]
      }
    ];

    return this.buildMonthsFromDefinitions(monthDefinitions, months);
  }

  // PYTHON FOR BACKEND DEVELOPER (Full 1 to 12 months, 4 weeks per month)
  private static buildPythonBackendCurriculum(months: number, level: string): RoadmapMonth[] {
    const monthDefinitions = [
      {
        monthNumber: 1,
        title: 'Month 1 — Python Core, OOP & Version Control',
        badgeColor: 'emerald' as const,
        weeks: [
          { title: 'Week 1 — Python Core & Data Structures', topicName: 'Lists, Dicts & Memory Management', desc: 'Generators, comprehensions, memory efficiency, primitive vs reference types.', priority: '🔴 Essential' as TopicPriority, cat: 'Core' },
          { title: 'Week 2 — Object-Oriented Programming (OOP)', topicName: 'Classes, Dunder Methods & Inheritance', desc: 'Class design, dunder methods, inheritance, encapsulation, polymorphism.', priority: '🔴 Essential' as TopicPriority, cat: 'OOP' },
          { title: 'Week 3 — Modules, Packages & Virtual Envs', topicName: 'Package Management & Virtual Environments', desc: 'pip, poetry, venv, module imports, package distribution.', priority: '🟡 Important' as TopicPriority, cat: 'Tooling' },
          { title: 'Week 4 — Git & GitHub Team Workflows', topicName: 'Git Branching & Pull Request Workflows', desc: 'Rebase, merge conflicts, Git hooks, conventional commits, PR code reviews.', priority: '🔴 Essential' as TopicPriority, cat: 'DevOps' }
        ]
      },
      {
        monthNumber: 2,
        title: 'Month 2 — REST APIs & FastAPI Framework',
        badgeColor: 'amber' as const,
        weeks: [
          { title: 'Week 5 — HTTP Protocol & Web Standards', topicName: 'HTTP Verbs, Headers & Status Codes', desc: 'REST principles, request/response lifecycle, JSON payloads, CORS policies.', priority: '🔴 Essential' as TopicPriority, cat: 'Networking' },
          { title: 'Week 6 — FastAPI Microservice Fundamentals', topicName: 'Async Endpoints & Pydantic Schemas', desc: 'Building high-performance async REST endpoints, request body validation.', priority: '🔴 Essential' as TopicPriority, cat: 'Framework' },
          { title: 'Week 7 — Dependency Injection & Middleware', topicName: 'FastAPI Dependencies & Custom Middleware', desc: 'Writing modular dependency injectors, logging middleware, exception handlers.', priority: '🟡 Important' as TopicPriority, cat: 'Architecture' },
          { title: 'Week 8 — REST API Milestone Project', topicName: 'Production-Ready E-Commerce Microservice', desc: 'Building end-to-end REST API with full validation, OpenAPI docs, unit tests.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 3,
        title: 'Month 3 — Relational Databases, PostgreSQL & ORM',
        badgeColor: 'cyan' as const,
        weeks: [
          { title: 'Week 9 — Relational Database Modeling', topicName: 'PostgreSQL Schema Design & Normalization', desc: '1NF to 3NF normalization, foreign keys, constraints, indexing strategies.', priority: '🔴 Essential' as TopicPriority, cat: 'Database' },
          { title: 'Week 10 — SQLAlchemy 2.0 Async ORM', topicName: 'SQLAlchemy Models & Async Sessions', desc: 'Defining DB models, executing async queries, eager loading relationships.', priority: '🔴 Essential' as TopicPriority, cat: 'Database' },
          { title: 'Week 11 — Database Migrations with Alembic', topicName: 'Alembic Migration Scripts & Rollbacks', desc: 'Automating schema migrations, version control for database schemas.', priority: '🟡 Important' as TopicPriority, cat: 'Database' },
          { title: 'Week 12 — Relational Database Backend Capstone', topicName: 'Database-backed Web Application API', desc: 'Connecting FastAPI to PostgreSQL database with complete CRUD operations.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 4,
        title: 'Month 4 — Security, Authentication & Authorization',
        badgeColor: 'purple' as const,
        weeks: [
          { title: 'Week 13 — User Password Hashing & Security', topicName: 'Bcrypt Hashing & Salting Patterns', desc: 'Secure user registration, password hashing with bcrypt/argon2, security policies.', priority: '🔴 Essential' as TopicPriority, cat: 'Security' },
          { title: 'Week 14 — JWT Token Authentication', topicName: 'OAuth2 & JWT Bearer Token Flows', desc: 'Issuing JWT access/refresh tokens, token verification middleware.', priority: '🔴 Essential' as TopicPriority, cat: 'Security' },
          { title: 'Week 15 — Role-Based Access Control (RBAC)', topicName: 'RBAC Authorization & Scopes', desc: 'Protecting admin endpoints, permission scopes, role check decorators.', priority: '🟡 Important' as TopicPriority, cat: 'Security' },
          { title: 'Week 16 — Secure Auth Gateway Project', topicName: 'Production User Auth & Identity Gateway', desc: 'Building complete auth microservice with login, token refresh, password reset.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 5,
        title: 'Month 5 — Asynchronous Tasks, Redis & Caching',
        badgeColor: 'indigo' as const,
        weeks: [
          { title: 'Week 17 — Redis Caching & Key-Value Store', topicName: 'Redis In-Memory Caching Strategies', desc: 'Cache invalidation, TTL expiration, session store, rate limiting.', priority: '🔴 Essential' as TopicPriority, cat: 'Performance' },
          { title: 'Week 18 — Celery / Arq Background Task Queues', topicName: 'Background Worker Queues & Workers', desc: 'Offloading email sending, video processing to asynchronous worker queues.', priority: '🔴 Essential' as TopicPriority, cat: 'Async Architecture' },
          { title: 'Week 19 — WebSockets & Real-Time Communication', topicName: 'WebSocket Connections & Pub/Sub', desc: 'Bidirectional real-time socket communication, chat server implementation.', priority: '🟡 Important' as TopicPriority, cat: 'Real-time' },
          { title: 'Week 20 — Distributed Task Processing Capstone', topicName: 'Real-time Notification & Task Engine', desc: 'Integrating FastAPI + Redis + Celery + WebSockets into cohesive system.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 6,
        title: 'Month 6 — System Design, Testing & Production Deployment',
        badgeColor: 'emerald' as const,
        weeks: [
          { title: 'Week 21 — Automated Testing with PyTest', topicName: 'PyTest Unit & Integration Testing', desc: 'Writing test fixtures, mocking database sessions, coverage reports.', priority: '🔴 Essential' as TopicPriority, cat: 'Testing' },
          { title: 'Week 22 — Docker Containerization & Docker Compose', topicName: 'Multi-container Docker Deployments', desc: 'Writing Dockerfiles, orchestrating app + Postgres + Redis with Docker Compose.', priority: '🔴 Essential' as TopicPriority, cat: 'DevOps' },
          { title: 'Week 23 — Cloud Deployment (AWS / GCP)', topicName: 'Production Cloud Hosting & Nginx Proxy', desc: 'Deploying containers to cloud instances, reverse proxy setup with Nginx.', priority: '🔴 Essential' as TopicPriority, cat: 'DevOps' },
          { title: 'Week 24 — Backend Engineering Job Clearance', topicName: 'System Design Interview & Capstone Audit', desc: 'System design mock interviews, GitHub portfolio presentation, resume polish.', priority: '🔴 Essential' as TopicPriority, cat: 'Career' }
        ]
      },
      {
        monthNumber: 7,
        title: 'Month 7 — Advanced Microservices & Event-Driven Architecture',
        badgeColor: 'amber' as const,
        weeks: [
          { title: 'Week 25 — Microservices Architecture Principles', topicName: 'Service Decomposition & API Gateways', desc: 'Monolith vs Microservices, service boundaries, reverse proxies & API gateways.', priority: '🔴 Essential' as TopicPriority, cat: 'Architecture' },
          { title: 'Week 26 — Message Brokers with Apache Kafka / RabbitMQ', topicName: 'Event Producer/Consumer Patterns', desc: 'Publish-subscribe queues, message partitioning, guaranteeing at-least-once delivery.', priority: '🔴 Essential' as TopicPriority, cat: 'Event Driven' },
          { title: 'Week 27 — Distributed Transactions & Saga Pattern', topicName: 'Saga Orchestration & Choreography', desc: 'Handling multi-service transactional rollbacks without 2PC deadlocks.', priority: '🟣 Advanced' as TopicPriority, cat: 'Architecture' },
          { title: 'Week 28 — Microservices Event Pipeline Capstone', topicName: 'Event-driven Order Processing Engine', desc: 'Building multi-service event pipeline using Kafka/RabbitMQ and FastAPI.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 8,
        title: 'Month 8 — NoSQL Databases & Search Engines',
        badgeColor: 'cyan' as const,
        weeks: [
          { title: 'Week 29 — MongoDB Document Database', topicName: 'MongoDB Aggregations & Schema Flexibility', desc: 'Document modeling, BSON data types, pipeline aggregation queries.', priority: '🔴 Essential' as TopicPriority, cat: 'NoSQL' },
          { title: 'Week 30 — Elasticsearch Full-Text Search', topicName: 'Elasticsearch Indexing & Fuzzy Queries', desc: 'Indexing JSON documents, fuzzy search queries, inverted index concepts.', priority: '🟡 Important' as TopicPriority, cat: 'Search' },
          { title: 'Week 31 — Graph Databases (Neo4j)', topicName: 'Cypher Query Language & Node Relations', desc: 'Modeling highly interconnected social graph data, Cypher pattern matching.', priority: '🔵 Optional' as TopicPriority, cat: 'Graph DB' },
          { title: 'Week 32 — Hybrid Database Application Capstone', topicName: 'Multi-Database E-Commerce Engine', desc: 'Combining Postgres (relational) + MongoDB (catalog) + Elastic (search).', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 9,
        title: 'Month 9 — Performance Optimization & High Scalability',
        badgeColor: 'purple' as const,
        weeks: [
          { title: 'Week 33 — Database Query Profiling & Indexing', topicName: 'EXPLAIN ANALYZE & Query Tuning', desc: 'Identifying slow query bottlenecks, composite B-tree indexes, connection pooling.', priority: '🔴 Essential' as TopicPriority, cat: 'Performance' },
          { title: 'Week 34 — Python Async IO Deep Dive (asyncio)', topicName: 'Async Event Loops, Tasks & Concurrency', desc: 'Concurrency vs parallelism, event loop blocking avoidance, CPU vs IO bounds.', priority: '🔴 Essential' as TopicPriority, cat: 'Core' },
          { title: 'Week 35 — Load Balancing & Horizontal Scaling', topicName: 'Gunicorn, Uvicorn & Worker Scaling', desc: 'Process manager configuration, round-robin load balancing, stateless servers.', priority: '🟡 Important' as TopicPriority, cat: 'Infrastructure' },
          { title: 'Week 36 — High-Throughput Load Testing Capstone', topicName: 'Locust Load Testing & Benchmark Audit', desc: 'Simulating 10,000 concurrent user requests, latency benchmarking.', priority: '🔴 Essential' as TopicPriority, cat: 'Performance' }
        ]
      },
      {
        monthNumber: 10,
        title: 'Month 10 — Observability, Monitoring & Logging',
        badgeColor: 'indigo' as const,
        weeks: [
          { title: 'Week 37 — Structured Logging (structlog / Loguru)', topicName: 'JSON Structured Logging & Context Correlation', desc: 'Contextual request tracking, trace IDs across microservice boundaries.', priority: '🔴 Essential' as TopicPriority, cat: 'Observability' },
          { title: 'Week 38 — Prometheus Metrics & Grafana Dashboards', topicName: 'Exposing App Metrics & Monitoring', desc: 'Prometheus counter/histogram metrics, building Grafana dashboard alerts.', priority: '🔴 Essential' as TopicPriority, cat: 'Observability' },
          { title: 'Week 39 — Distributed Tracing with OpenTelemetry', topicName: 'OpenTelemetry Spans & Jaeger Tracing', desc: 'Tracing request bottlenecks across multiple microservices with Jaeger.', priority: '🟡 Important' as TopicPriority, cat: 'Observability' },
          { title: 'Week 40 — Full Production Observability Capstone', topicName: 'Enterprise Observability Stack Integration', desc: 'Integrating Prometheus + Grafana + OpenTelemetry into backend stack.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 11,
        title: 'Month 11 — Cloud Infrastructure & Kubernetes',
        badgeColor: 'emerald' as const,
        weeks: [
          { title: 'Week 41 — Kubernetes Core Concepts', topicName: 'K8s Pods, Deployments & Services', desc: 'Writing Kubernetes manifests, managing container clusters, rolling updates.', priority: '🔴 Essential' as TopicPriority, cat: 'DevOps' },
          { title: 'Week 42 — Infrastructure as Code (Terraform)', topicName: 'Terraform Modules & Cloud Provisioning', desc: 'Automating AWS EC2, RDS, and S3 resource creation with Terraform declarative code.', priority: '🟡 Important' as TopicPriority, cat: 'DevOps' },
          { title: 'Week 43 — CI/CD Pipeline Automation', topicName: 'GitHub Actions / GitLab CI Pipelines', desc: 'Automating build, test, container push, and Kubernetes deployment.', priority: '🔴 Essential' as TopicPriority, cat: 'DevOps' },
          { title: 'Week 44 — Cloud Infrastructure Capstone', topicName: 'Automated Kubernetes Deployment', desc: 'Deploying backend platform to cloud Kubernetes cluster with automated CI/CD.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 12,
        title: 'Month 12 — Senior Backend Engineer & Career Mastery',
        badgeColor: 'cyan' as const,
        weeks: [
          { title: 'Week 45 — Advanced System Design & Distributed Consensus', topicName: 'CAP Theorem, Raft & Distributed Locks', desc: 'Designing resilient distributed systems handling network partitions.', priority: '🔴 Essential' as TopicPriority, cat: 'System Design' },
          { title: 'Week 46 — Security Auditing & OWASP Compliance', topicName: 'OWASP Top 10 Security Defenses', desc: 'Preventing SQL injection, XSS, CSRF, rate-limit bypasses, secret storage.', priority: '🔴 Essential' as TopicPriority, cat: 'Security' },
          { title: 'Week 47 — Final Senior Portfolio Review', topicName: 'Complete Codebase Audit & Open Source', desc: 'Reviewing production projects, writing technical architecture documentation.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' },
          { title: 'Week 48 — Senior Backend Interview & Placement', topicName: 'System Architecture Interview Clearance', desc: 'Mock architectural interviews, resume optimization, job offer negotiation.', priority: '🔴 Essential' as TopicPriority, cat: 'Career' }
        ]
      }
    ];

    return this.buildMonthsFromDefinitions(monthDefinitions, months);
  }

  // PYTHON FOR AUTOMATION (Full 1 to 12 months, 4 weeks per month)
  private static buildPythonAutomationCurriculum(months: number, level: string): RoadmapMonth[] {
    const monthDefinitions = [
      {
        monthNumber: 1,
        title: 'Month 1 — Scripting, File I/O & OS Automation',
        badgeColor: 'emerald' as const,
        weeks: [
          { title: 'Week 1 — Python Scripting & OS Module', topicName: 'OS, sys & Pathlib Automation', desc: 'Automating file renaming, folder organization, environment variables.', priority: '🔴 Essential' as TopicPriority, cat: 'Scripting' },
          { title: 'Week 2 — Text Manipulation & Regular Expressions', topicName: 'Regex Extraction & Text Parsing', desc: 'Extracting emails, URLs, dates, and log patterns using re module.', priority: '🔴 Essential' as TopicPriority, cat: 'Scripting' },
          { title: 'Week 3 — File I/O & Excel/CSV Manipulation', topicName: 'OpenPyXL & CSV Data Automation', desc: 'Automating Excel spreadsheet creation, cell styling, formulas.', priority: '🔴 Essential' as TopicPriority, cat: 'Automation' },
          { title: 'Week 4 — Desktop File Organizer Project', topicName: 'Automated Directory & File Cleaning Tool', desc: 'Building CLI tool that sorts messy downloads by file type and date.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 2,
        title: 'Month 2 — Web Scraping & API Automation',
        badgeColor: 'amber' as const,
        weeks: [
          { title: 'Week 5 — Requests & Web Scraping Fundamentals', topicName: 'HTTP Requests & HTML DOM Parsing', desc: 'Fetching web pages, handling user agents, parsing tables with BeautifulSoup.', priority: '🔴 Essential' as TopicPriority, cat: 'Scraping' },
          { title: 'Week 6 — Playwright Modern Browser Control', topicName: 'Playwright Headless Automation', desc: 'Automating login forms, button clicks, screenshot capture, PDF generation.', priority: '🔴 Essential' as TopicPriority, cat: 'Web Automation' },
          { title: 'Week 7 — Handling Captchas & Dynamic Content', topicName: 'Dynamic SPA Scraping & Anti-bot Bypassing', desc: 'Scraping single-page React apps, rate limiting, proxy rotation.', priority: '🟡 Important' as TopicPriority, cat: 'Scraping' },
          { title: 'Week 8 — Automated Price Monitoring Bot', topicName: 'Real-time Web Scraper & Price Tracker', desc: 'Building bot that monitors product prices and sends email/Telegram alerts.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 3,
        title: 'Month 3 — Task Scheduling, GUI & System Bot Capstone',
        badgeColor: 'cyan' as const,
        weeks: [
          { title: 'Week 9 — Task Scheduling (Cron & Schedule module)', topicName: 'Cron Jobs & Scheduled Execution', desc: 'Running Python scripts periodically in background on Windows/Linux.', priority: '🔴 Essential' as TopicPriority, cat: 'Scheduling' },
          { title: 'Week 10 — Desktop GUI Automation (PyAutoGUI)', topicName: 'Mouse & Keyboard Desktop Control', desc: 'Simulating mouse clicks, key presses, image recognition on screen.', priority: '🟡 Important' as TopicPriority, cat: 'Desktop Automation' },
          { title: 'Week 11 — Email & Telegram Bot Integration', topicName: 'SMTPLib, Email & Telegram Bot APIs', desc: 'Automating daily status reports, sending attachments, receiving bot commands.', priority: '🔴 Essential' as TopicPriority, cat: 'Bots' },
          { title: 'Week 12 — End-to-End Enterprise Automation Bot', topicName: 'Autonomous Workflow Bot Capstone', desc: 'Building comprehensive bot that scrapes, processes, generates reports, emails.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      }
    ];

    // Pad up to 12 months using generic generator pattern if needed
    return this.buildMonthsFromDefinitions(monthDefinitions, months);
  }

  // PYTHON FOR DATA SCIENCE (Full 1 to 12 months, 4 weeks per month)
  private static buildPythonDataScienceCurriculum(months: number, level: string): RoadmapMonth[] {
    const monthDefinitions = [
      {
        monthNumber: 1,
        title: 'Month 1 — Math, Linear Algebra & NumPy/Pandas',
        badgeColor: 'emerald' as const,
        weeks: [
          { title: 'Week 1 — Linear Algebra & Calculus Basics', topicName: 'Vectors, Matrices & Derivatives', desc: 'Matrix multiplication, eigenvalues, gradient descent intuition.', priority: '🔴 Essential' as TopicPriority, cat: 'Math' },
          { title: 'Week 2 — NumPy Vectorized Computation', topicName: 'Multidimensional Array Computing', desc: 'ND-array manipulation, broadcasting, mathematical functions.', priority: '🔴 Essential' as TopicPriority, cat: 'Core Data Science' },
          { title: 'Week 3 — Pandas Data Wrangling & Cleaning', topicName: 'DataFrames, Indexing & Missing Data', desc: 'Data cleaning, feature transformation, handling null values.', priority: '🔴 Essential' as TopicPriority, cat: 'Core Data Science' },
          { title: 'Week 4 — Exploratory Data Analysis Capstone', topicName: 'EDA Portfolio Project', desc: 'Conducting comprehensive EDA on real-world dataset with visuals.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 2,
        title: 'Month 2 — Machine Learning with Scikit-Learn',
        badgeColor: 'amber' as const,
        weeks: [
          { title: 'Week 5 — Supervised Learning (Regression)', topicName: 'Linear & Polynomial Regression', desc: 'Model training, MSE/RMSE metrics, regularized Ridge/Lasso regression.', priority: '🔴 Essential' as TopicPriority, cat: 'Machine Learning' },
          { title: 'Week 6 — Supervised Learning (Classification)', topicName: 'Logistic Regression & Decision Trees', desc: 'Classification metrics, confusion matrix, precision, recall, F1-score.', priority: '🔴 Essential' as TopicPriority, cat: 'Machine Learning' },
          { title: 'Week 7 — Ensemble Models (Random Forest & XGBoost)', topicName: 'Random Forests & Gradient Boosting', desc: 'Tree ensembling, hyperparameter tuning with GridSearchCV, feature importance.', priority: '🔴 Essential' as TopicPriority, cat: 'Machine Learning' },
          { title: 'Week 8 — Machine Learning Capstone', topicName: 'End-to-End Predictive Model Project', desc: 'Building, tuning, and evaluating complete predictive ML model.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      },
      {
        monthNumber: 3,
        title: 'Month 3 — Deep Learning & Neural Networks',
        badgeColor: 'cyan' as const,
        weeks: [
          { title: 'Week 9 — Neural Network Fundamentals', topicName: 'Perceptrons, Activations & Backpropagation', desc: 'Forward pass, loss functions, Adam optimizer, gradient backpropagation.', priority: '🔴 Essential' as TopicPriority, cat: 'Deep Learning' },
          { title: 'Week 10 — PyTorch Framework Basics', topicName: 'PyTorch Tensors & Custom Modules', desc: 'Building neural network architectures using PyTorch nn.Module.', priority: '🔴 Essential' as TopicPriority, cat: 'Deep Learning' },
          { title: 'Week 11 — Convolutional Neural Networks (CNNs)', topicName: 'Image Classification with CNNs', desc: 'Convolutional layers, pooling, transfer learning with ResNet.', priority: '🟡 Important' as TopicPriority, cat: 'Computer Vision' },
          { title: 'Week 12 — Deep Learning Vision Capstone', topicName: 'Image Classification & Object Recognition', desc: 'Building image classifier deployed as web application.', priority: '🔴 Essential' as TopicPriority, cat: 'Portfolio' }
        ]
      }
    ];

    return this.buildMonthsFromDefinitions(monthDefinitions, months);
  }

  // GENERAL PYTHON
  private static buildPythonGeneralCurriculum(months: number, level: string): RoadmapMonth[] {
    return this.buildPythonDataAnalystCurriculum(months, level);
  }

  // GENERIC CURRICULUM GENERATOR FOR ANY OTHER SKILL (Web Dev, Marketing, Excel, SSC CGL, Finance, Java, etc.)
  private static buildGenericCurriculum(skill: string, goal: string, months: number, level: string): RoadmapMonth[] {
    const result: RoadmapMonth[] = [];

    const badgeColors: ('emerald' | 'amber' | 'cyan' | 'purple' | 'indigo')[] = [
      'emerald', 'amber', 'cyan', 'purple', 'indigo', 'emerald', 'amber', 'cyan', 'purple', 'indigo', 'emerald', 'amber'
    ];

    for (let m = 1; m <= months; m++) {
      const weeks: RoadmapModule[] = [];
      for (let w = 1; w <= 4; w++) {
        const globalWeekNum = (m - 1) * 4 + w;
        const topicPriority: TopicPriority = w === 1 || w === 4 ? '🔴 Essential' : w === 2 ? '🟡 Important' : '🔵 Optional';
        
        weeks.push({
          id: `gen-w-${m}-${w}`,
          monthNumber: m,
          weekNumber: globalWeekNum,
          title: `Week ${globalWeekNum} — ${skill} Module ${m}.${w}`,
          status: m === 1 && w === 1 ? 'active' : 'upcoming',
          topics: [
            {
              id: `gen-top-${m}-${w}`,
              name: `${skill} Core Concepts & Implementation (${m}.${w})`,
              priority: topicPriority,
              estimatedMinutes: 60,
              category: w === 4 ? 'Portfolio Project' : 'Core Concept',
              status: m === 1 && w === 1 ? 'in_progress' : 'pending',
              mastery: m === 1 && w === 1 ? 35 : 0,
              masteryLevel: m === 1 && w === 1 ? 'Developing' : 'Awareness',
              description: w === 4 
                ? `Build hands-on milestone project consolidating Week ${globalWeekNum - 3} to ${globalWeekNum} concepts.`
                : `Master key principles, best practices, and hands-on exercises for ${skill}.`,
              resources: this.createResources(`${skill} Official Guide`, 'https://google.com', `Essential starter guide for ${skill}`)
            }
          ]
        });
      }

      result.push({
        monthNumber: m,
        title: `Month ${m} — ${skill} Phase ${m}: ${m === 1 ? 'Foundations & Basics' : m === 2 ? 'Intermediate Practice' : m === 3 ? 'Advanced Systems & Projects' : 'Specialization & Career Mastery'}`,
        badgeColor: badgeColors[(m - 1) % badgeColors.length],
        status: m === 1 ? 'active' : 'upcoming',
        weeks
      });
    }

    return result;
  }

  /**
   * Helper to build RoadmapMonth array from structured definitions up to requested months.
   */
  private static buildMonthsFromDefinitions(
    definitions: Array<{
      monthNumber: number;
      title: string;
      badgeColor: 'emerald' | 'amber' | 'cyan' | 'purple' | 'indigo';
      weeks: Array<{ title: string; topicName: string; desc: string; priority: TopicPriority; cat: string }>;
    }>,
    targetMonthsCount: number
  ): RoadmapMonth[] {
    const result: RoadmapMonth[] = [];

    for (let m = 1; m <= targetMonthsCount; m++) {
      const def = definitions.find(d => d.monthNumber === m);
      
      if (def) {
        const weeks: RoadmapModule[] = def.weeks.map((wDef, idx) => {
          const globalWeekNum = (m - 1) * 4 + (idx + 1);
          const topicId = `top-m${m}-w${idx + 1}`;
          
          return {
            id: `w-${m}-${idx + 1}`,
            monthNumber: m,
            weekNumber: globalWeekNum,
            title: wDef.title,
            status: m === 1 && idx === 0 ? 'completed' : m === 1 && idx === 1 ? 'active' : 'upcoming',
            topics: [
              {
                id: topicId,
                name: wDef.topicName,
                priority: wDef.priority,
                estimatedMinutes: 60,
                category: wDef.cat,
                status: m === 1 && idx === 0 ? 'completed' : m === 1 && idx === 1 ? 'in_progress' : 'pending',
                mastery: m === 1 && idx === 0 ? 85 : m === 1 && idx === 1 ? 50 : 0,
                masteryLevel: m === 1 && idx === 0 ? 'Strong' : m === 1 && idx === 1 ? 'Developing' : 'Awareness',
                description: wDef.desc,
                resources: this.createResources(wDef.topicName, 'https://docs.python.org', wDef.desc)
              }
            ]
          };
        });

        result.push({
          monthNumber: m,
          title: def.title,
          badgeColor: def.badgeColor,
          status: m === 1 ? 'active' : 'upcoming',
          weeks
        });
      } else {
        // Generate fallback month for months > defined length
        const weeks: RoadmapModule[] = [];
        for (let w = 1; w <= 4; w++) {
          const globalWeekNum = (m - 1) * 4 + w;
          weeks.push({
            id: `w-gen-${m}-${w}`,
            monthNumber: m,
            weekNumber: globalWeekNum,
            title: `Week ${globalWeekNum} — Advanced Module ${m}.${w}`,
            status: 'upcoming',
            topics: [
              {
                id: `top-gen-${m}-${w}`,
                name: `Advanced Field Mastery & Project ${m}.${w}`,
                priority: w === 4 ? '🔴 Essential' : '🟡 Important',
                estimatedMinutes: 60,
                category: w === 4 ? 'Portfolio' : 'Specialization',
                status: 'pending',
                mastery: 0,
                masteryLevel: 'Awareness',
                description: `Specialized domain project and advanced practical problem solving.`,
                resources: this.createResources('Advanced Mastery Guide', 'https://google.com', 'Domain reference guide')
              }
            ]
          });
        }

        const badgeColors: ('emerald' | 'amber' | 'cyan' | 'purple' | 'indigo')[] = ['emerald', 'amber', 'cyan', 'purple', 'indigo'];
        result.push({
          monthNumber: m,
          title: `Month ${m} — Specialized Industry Practice & Career Mastery`,
          badgeColor: badgeColors[(m - 1) % badgeColors.length],
          status: 'upcoming',
          weeks
        });
      }
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
