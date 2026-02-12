
const TEMPLATE_TASKS = {
  "Web App": {
    frontend: [
      "Implement routing and navigation",
      "Build authentication UI (login/signup)",
      "Create reusable UI components library",
      "Integrate with backend API and handle responses",
      "Add form validation and error handling",
      "Implement responsive layout and theming",
    ],
    backend: [
      "Set up REST/GraphQL API structure",
      "Implement authentication (JWT/sessions)",
      "Add authorization and role-based access",
      "Create API controllers and services",
      "Add request validation middleware",
    ],
    database: [
      "Design and implement schema",
      "Create migrations and seed data",
      "Set up indexing for query performance",
      "Configure backup and recovery",
    ],
    testing: [
      "Unit tests for core business logic",
      "Integration tests for API endpoints",
      "E2E tests for critical user flows",
    ],
    devops: [
      "CI/CD pipeline configuration",
      "Docker containerization",
      "Configure staging and production environments",
    ],
  },
  "Mobile App": {
    frontend: [
      "Set up navigation (stack/tab/bottom nav)",
      "Implement state management (Redux/Zustand)",
      "Create API service layer and error handling",
      "Build offline support and data sync",
      "Add push notifications setup",
      "Implement deep linking",
    ],
    backend: [
      "Design mobile-friendly API endpoints",
      "Implement auth with refresh tokens",
      "Add rate limiting and throttling",
      "Optimize payloads for mobile (pagination, compression)",
    ],
    database: [
      "Design schema with mobile use cases in mind",
      "Set up caching layer (Redis)",
      "Implement audit logging",
    ],
    testing: [
      "Unit tests for state and utilities",
      "API integration tests",
      "Device and simulator testing",
    ],
    devops: [
      "App store build and release pipeline",
      "OTA updates configuration",
      "Analytics and crash reporting setup",
    ],
  },
  "Internal Tool": {
    frontend: [
      "Build dashboard with key metrics",
      "Implement data tables with filtering and sorting",
      "Add export to CSV/Excel functionality",
      "Create role-based UI visibility",
      "Implement bulk actions and batch operations",
      "Add search and advanced filters",
    ],
    backend: [
      "Create admin API endpoints",
      "Implement audit logging",
      "Add bulk import/export APIs",
      "Set up scheduled jobs",
    ],
    database: [
      "Design schema for operational data",
      "Add audit tables and history tracking",
      "Configure read replicas if needed",
    ],
    testing: [
      "Unit tests for business rules",
      "Integration tests for admin flows",
      "Data export validation tests",
    ],
    devops: [
      "Internal deployment pipeline",
      "Access control and network policies",
      "Monitoring and alerting setup",
    ],
  },
  "API Service": {
    frontend: [],
    backend: [
      "Define API schema (OpenAPI/Swagger)",
      "Implement core endpoints",
      "Add authentication and API key management",
      "Create rate limiting and quotas",
      "Implement request/response validation",
      "Add versioning strategy",
    ],
    database: [
      "Design data model and relationships",
      "Create migrations",
      "Set up connection pooling",
    ],
    testing: [
      "Contract/API tests",
      "Load and performance tests",
      "Security and penetration tests",
    ],
    devops: [
      "API documentation generation",
      "CI/CD with automated testing",
      "Gateway and load balancer config",
    ],
  },
};


const COMPLEXITY_MULTIPLIER = { Low: 0.5, Medium: 1, High: 1.5 };


function generateUserStories(input) {
  const users = input.users?.length ? input.users.join(", ") : "user";
  const goal = input.goal || "achieve the stated objectives";

  return [
    `As a ${users}, I want to ${goal.toLowerCase()} so that I can accomplish my goals efficiently.`,
    `As a ${users}, I want to have a clear and intuitive interface so that I can complete tasks without confusion.`,
    `As a ${users}, I want to receive timely feedback on my actions so that I know the system is responding correctly.`,
    `As a ${users}, I want my data to be secure and private so that I can trust the platform with sensitive information.`,
    `As a ${users}, I want the system to perform reliably so that I can depend on it for my daily workflow.`,
  ];
}


function generateRisks(input) {
  const constraints = input.constraints || "";

  return [
    "Scope creep without clear MVP boundaries – recommend phased delivery.",
    "Integration complexity with legacy or third-party systems – plan discovery sprints.",
    constraints.toLowerCase().includes("timeline") || constraints.toLowerCase().includes("deadline")
      ? "Aggressive timeline may compromise quality – prioritize critical features."
      : "Resource and skill gaps – ensure team capacity and upskilling plan.",
  ];
}


function toTaskObjects(tasks) {
  return tasks.map((text) => ({ text, completed: false }));
}


function sliceByComplexity(tasks, complexity) {
  const mult = COMPLEXITY_MULTIPLIER[complexity] ?? 1;
  const count = Math.max(1, Math.round(tasks.length * mult));
  return tasks.slice(0, count);
}

function generateSpecData(input) {
  const templateType = input.templateType || "Web App";
  const complexity = input.complexity || "Medium";
  const taskSet = TEMPLATE_TASKS[templateType] ?? TEMPLATE_TASKS["Web App"];

  const tasks = {};
  for (const [key, arr] of Object.entries(taskSet)) {
    const sliced = sliceByComplexity(arr, complexity);
    tasks[key] = toTaskObjects(sliced);
  }

  return {
    title: input.title || "Untitled Spec",
    goal: input.goal || "",
    users: Array.isArray(input.users) ? input.users : input.users ? [String(input.users)] : [],
    constraints: input.constraints || "",
    templateType,
    complexity,
    userStories: generateUserStories(input),
    tasks,
    risks: generateRisks(input),
  };
}

module.exports = { generateSpecData };
