# Build, Test, Host and Deploy a Complete AI Chatbot Project — Zero Cost

Act as a senior full-stack developer, AI/ML engineer, UI/UX designer, QA engineer, and DevOps engineer. You are responsible for completing my entire college project end-to-end, including implementation, testing, deployment, documentation, and a final working demo.

## 1. Project details

**Project Name:** CampusMate AI — Intelligent College Assistant Chatbot

**Subject:** CSDX 142 — AI Chatbot Application

**Objective:** Build an interactive, intelligent chatbot that helps college students with academic information, syllabus questions, exam preparation, placement guidance, college FAQs, and general student queries.

This is an academic project. It must demonstrate concepts from all five modules of my syllabus:

- Module I: Dialogue systems, dialogue modelling, architecture, conversation management, and tools.
- Module II: Conversational UI, conversation design, chatbot training, data sources, and development approaches.
- Module III: Business considerations, decision trees, chatbot frameworks, components, conversational applications, and Dialogflow concepts.
- Module IV: NLP methods, text processing, intent classification, entity extraction, spaCy concepts, and chatbot deployment.
- Module V: Multimodal dialogue, reasoning, problem-solving, ethical considerations, and future development.

## 2. Absolute constraints

1. The total project cost must be ₹0.
2. Do not use paid APIs, paid AI models, paid databases, paid hosting, paid domains, or paid subscriptions.
3. Do not require a credit card or activate a paid trial.
4. Do not use OpenAI, Gemini, Claude, or other paid API dependencies.
5. Prefer an architecture that works without API keys, a cloud backend, or a continuously running server.
6. Use free and open-source libraries wherever possible.
7. Deploy a publicly accessible HTTPS demo using a genuinely free hosting option, preferably GitHub Pages.
8. Do not claim a service is free unless you verify its current limitations and requirements.
9. If any proposed service requires payment, a credit card, or a paid plan, choose another solution.
10. Never expose credentials, API keys, or personal information in source code or public repositories.

## 3. Recommended technology stack

Use the simplest reliable stack that supports the requirements:

- Frontend: React, TypeScript, Vite.
- Styling: Tailwind CSS or a lightweight CSS solution.
- Chat interface: Custom responsive React components.
- NLP: TypeScript/JavaScript-based text normalization, tokenization, intent classification, entity extraction, and TF-IDF/cosine similarity or another lightweight local approach.
- Knowledge retrieval: Local, structured JSON knowledge base with source references.
- Conversation management: Finite-state machine, dialogue context, decision trees, and follow-up handling.
- Persistence: Browser localStorage for chat history and preferences.
- Hosting: GitHub Pages or another verified zero-cost static host.
- Testing: Unit tests and browser-based interaction tests where feasible.

You may choose a better architecture if necessary, but justify the choice and preserve the zero-cost requirement.

The chatbot must work without a remote AI API. Do not pretend a rule-based system or retrieval system is a large language model. Explain honestly which parts use NLP, retrieval, decision trees, and deterministic logic.

## 4. Chatbot functionality

Build a polished, functional application with the following features.

### A. Chat interface
- Modern, professional design suitable for a college project demonstration.
- Responsive layout for laptop, desktop, tablet, and mobile.
- Clear messages for the user and chatbot.
- Typing/loading indicator when appropriate.
- Suggested questions and clickable quick replies.
- Timestamps, clear-chat action, and persistent conversation history.
- Enter to send and Shift+Enter for a new line.
- Welcome message and example questions.
- Light/dark theme if practical.
- Accessible buttons, readable fonts, and appropriate contrast.
- No excessively small text, unnecessary whitespace, or layout overflow.

### B. Student knowledge base
Create a useful initial knowledge base containing sample data for:

- Course syllabus and modules.
- Subjects and course objectives.
- Exam preparation and study guidance.
- Placement preparation and interview FAQs.
- College services and student FAQs.
- Academic terminology and definitions.
- General chatbot help and supported commands.

Make it easy to add or edit information through JSON or another simple local format.

Clearly label all invented college information as sample/demo data. Never present fabricated university rules, dates, schedules, or contact details as real facts.

Allow the user to add sample FAQ documents or import a supported local text/JSON knowledge file if practical.

### C. NLP functionality
Implement real, demonstrable NLP features:

- Lowercase normalization and punctuation handling.
- Tokenization and stop-word handling.
- Intent detection for greetings, syllabus questions, exam preparation, placements, FAQs, and fallback requests.
- Entity extraction for module numbers, subject names, topics, and other supported fields.
- Similarity-based retrieval to find relevant knowledge-base entries.
- Confidence scoring and a configurable rejection threshold.
- Appropriate clarification when the query is ambiguous.
- Fallback responses when the answer is not known.
- Basic context retention for follow-up questions.
- A small evaluation dataset containing test questions and expected intents.

Do not simply match a few exact keywords and call the result AI. Use a measurable NLP/retrieval approach and explain its limitations.

### D. Dialogue management
Implement:

- A documented dialogue-system architecture.
- Conversation states and transitions.
- A decision-tree-based guided flow.
- Context-aware follow-up questions.
- An option to restart a conversation flow.
- An explanation of how the system chooses a response.
- A conversation log visible in a developer/demo panel.

### E. Additional features
If achievable without introducing paid services or unreliable dependencies, add:

- A simple quiz mode for syllabus topics.
- A placement interview practice flow.
- A chatbot feedback button.
- A small analytics dashboard showing total messages, detected intents, fallback count, and confidence distribution.
- A demo mode with preloaded questions.

Prioritize a fully working core application over unnecessary features.

## 5. Syllabus demonstration panel

Add a dedicated page or panel called “How This Chatbot Works”.

It must explain the following in simple language:

1. Dialogue-system architecture and conversation lifecycle.
2. Conversational UI and user experience.
3. Decision trees and dialogue state management.
4. NLP pipeline and intent classification.
5. Entity extraction and similarity-based retrieval.
6. Knowledge-base construction and chatbot training/configuration.
7. Reasoning and problem-solving limitations.
8. Privacy, ethical considerations, and future enhancements.

Include a flow diagram such as:

User Message → Text Preprocessing → Intent and Entity Detection → Knowledge Retrieval → Confidence Check → Dialogue Manager → Response → Conversation History.

Explain how each component is implemented in the actual code. Do not describe features that do not exist.

## 6. User interface quality

Make the application look like a polished, modern software product rather than a basic college assignment.

Include:

- A clean home page with project name and description.
- A prominent “Start Chatting” action.
- An intuitive chat workspace.
- A sidebar or navigation for Chat, Quiz, Knowledge Base, Analytics, and About.
- Attractive but restrained colors, consistent spacing, cards, and icons.
- A clear footer with project and academic information.
- Useful empty states, loading states, error messages, and success feedback.
- A mobile-friendly navigation system.

Keep all major content visible at normal browser zoom. Avoid tiny text, clipped content, unnecessary scrolling, and horizontal overflow.

## 7. Project structure and code quality

Create a clean, maintainable project structure.

Separate:

- UI components.
- Chat engine.
- NLP preprocessing.
- Intent classification.
- Entity extraction.
- Retrieval and ranking.
- Dialogue manager.
- Knowledge-base data.
- Local storage.
- Analytics.
- Tests.

Include a README.md, package.json, deployment configuration, sample data, and all required source files.

Use TypeScript types where appropriate. Avoid unnecessary dependencies, duplicated logic, fake buttons, placeholder pages, and hard-coded absolute local paths.

## 8. Testing and debugging

You must actually run and test the application.

Perform these steps:

1. Inspect the development environment and available GitHub/deployment access.
2. Create the application and install dependencies.
3. Run type checking, linting, and production build checks.
4. Write and run tests for NLP, intent classification, retrieval, dialogue management, and key UI interactions.
5. Test greetings, syllabus questions, paraphrased questions, follow-ups, unknown questions, empty input, and malformed input.
6. Verify that chat history works and can be cleared.
7. Test responsive layouts and check for console errors.
8. Fix all critical errors and rerun failed tests.
9. Verify the production build.
10. Test the deployed URL, not just localhost.

Never claim a test passed unless you ran it and observed the result.

## 9. End-to-end deployment

Deploy the application to a free public HTTPS URL.

- Prefer GitHub Pages for the static frontend.
- Configure the correct Vite base path for the GitHub repository.
- Create a Git repository if appropriate.
- Use the authenticated GitHub integration or existing CLI authentication if available.
- Never ask me to reveal passwords, personal access tokens, or secrets in chat.
- Do not publish local environment files, credentials, or private data.
- If I must authorize GitHub or approve a deployment, tell me exactly what action is required.
- If deployment cannot be completed automatically, finish all other work and provide the shortest precise remaining steps.
- Do not claim that deployment succeeded until the public URL has been tested.

## 10. Academic documentation and final demo

Generate these deliverables inside the project:

1. README.md with project overview, installation, architecture, and usage.
2. A project report describing the problem statement, objectives, methodology, modules, implementation, testing, limitations, and future scope.
3. Architecture and dialogue-flow diagrams.
4. A mapping of the implementation to all five syllabus modules.
5. A test report with actual test results.
6. A demo script lasting approximately five minutes.
7. Ten sample questions that demonstrate the chatbot's capabilities.
8. A section explaining why the chosen architecture has zero recurring API/hosting costs and what limitations apply.
9. A list of future improvements, including optional LLM integration, multilingual support, and multimodal input, clearly marked as future work if not implemented.

Use realistic, clearly identified demo data. Do not invent actual university policies or claim that sample data is official.

## 11. How you must work

Work autonomously wherever permissions allow.

Do not stop after creating a plan, writing code, or displaying code snippets. Create the actual files, run the application, test it, fix errors, build it, and deploy it.

Do not ask me questions that you can reasonably resolve with sensible defaults. If an external authorization is unavoidable, explain the exact action needed and continue with all other tasks.

At each milestone, briefly report what was completed and any genuine blocker.

## 12. Final response requirements

When finished, provide:

- Public demo URL.
- GitHub repository URL.
- Confirmation of which deployment and tests were actually verified.
- Exact commands to run the project locally on my MacBook.
- Project folder structure.
- Technologies used.
- Feature checklist.
- Explanation of how each syllabus module is demonstrated.
- Documentation and report file locations.
- Any remaining manual steps or limitations.

The final deliverable must be a working, demonstrable, zero-cost chatbot project, not merely a prototype description.

Start by inspecting the available tools and environment, then execute the project from creation through deployment.