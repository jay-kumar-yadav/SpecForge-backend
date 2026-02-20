# Prompts Used for App Development

This file records the prompts used during development. Agent responses, API keys, and other sensitive data are not included.

---

## Spec Generation (LLM)

**Purpose**: Generate product spec from user input (used in `server/utils/llmService.js`)  
**Provider**: Groq Cloud (Llama)

**Prompt** (summarized structure):
- System role: "You are a product spec writer. Generate a structured product specification in JSON format."
- Inputs injected: Title, Goal, Target Users, Template Type, Complexity, Constraints
- Output format: JSON with `title`, `goal`, `userStories`, `tasks` (frontend/backend/database/testing/devops), `risks`
- Requirements: 4–6 user stories in "As a X, I want to Y so that Z" format; 3–8 tasks per category; 3–5 risks
- Instruction: "Return ONLY valid JSON."

**Output schema** (expected from LLM):
```json
{
  "title": "string",
  "goal": "string",
  "userStories": ["As a X, I want to Y so that Z"],
  "tasks": {
    "frontend": ["string"],
    "backend": ["string"],
    "database": ["string"],
    "testing": ["string"],
    "devops": ["string"]
  },
  "risks": ["string"]
}
```

---

## Feature Development

**Purpose**: General development assistance

- "Integrate Large Language Model (LLM) APIs to demonstrate your ability to build AI-driven features."
- "Document your AI development process, including prompt engineering strategies and PROMPTS_USED.md files."
- "Strengthen backend logic and data parsing capabilities to handle complex model responses efficiently."
- "A simple home page with clear steps"
- "A status page, that shows health of backend, database, and llm connection."
- "Basic handling for empty/wrong input"

---

## UI / UX

**Purpose**: Dashboard and layout improvements

- "Make dashboard page more attractive UI"
- "Replace emoji icons with SVG icons that don't look AI-generated"

---

## Configuration & Deployment

**Purpose**: Deployment setup

- "Replace localhost with deployed backend URL for production"
- "Add CORS for Vercel frontend"
