/**
 * backend/src/services/ai.service.js
 *
 * FOUNDATION ONLY — Sprint 1.
 *
 * This is the single entry point the rest of the backend will use to
 * talk to an LLM. Right now it exposes one function, callLLM(), which
 * sends a prompt to whichever provider is configured (Gemini or
 * OpenAI) and returns the plain text response.
 *
 * Everything listed in the Sprint 2+ roadmap at the bottom of this
 * file (summarization, requirement extraction, repo understanding,
 * evidence-based judging, tech recommendations) will be built ON TOP
 * of callLLM() later. They are intentionally NOT implemented yet.
 */

const { config, validateConfig } = require('../config/ai.config');

// SDK clients are created lazily (only the first time they're needed)
// so we don't waste time/memory initializing a client we never use.
let geminiClient = null;
let openaiClient = null;

function getGeminiClient() {
  if (!geminiClient) {
    // npm install @google/generative-ai
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    geminiClient = new GoogleGenerativeAI(config.gemini.apiKey);
  }
  return geminiClient;
}

function getOpenAIClient() {
  if (!openaiClient) {
    // npm install openai
    const OpenAI = require('openai');
    openaiClient = new OpenAI({ apiKey: config.openai.apiKey });
  }
  return openaiClient;
}

/**
 * Sends a single text prompt to the configured LLM provider and
 * returns the model's plain-text response.
 *
 * @param {string} prompt - The text prompt to send to the LLM.
 * @returns {Promise<string>} The model's text response.
 */
async function callLLM(prompt) {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('callLLM() requires a non-empty string prompt.');
  }

  validateConfig();

  if (config.provider === 'gemini') {
    const client = getGeminiClient();
    const model = client.getGenerativeModel({ model: config.gemini.model });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  if (config.provider === 'openai') {
    const client = getOpenAIClient();
    const response = await client.chat.completions.create({
      model: config.openai.model,
      messages: [{ role: 'user', content: prompt }],
    });
    return response.choices[0].message.content;
  }

  // Should be unreachable — ai.config.js already validates the provider.
  throw new Error(`Unhandled AI provider: ${config.provider}`);
}

/* ------------------------------------------------------------------
 * Sprint 2+ roadmap (NOT implemented yet — do not build these now):
 *
 *   async function summarizeProject(projectData) { ... }
 *   async function extractRequirements(problemStatement) { ... }
 *   async function analyzeRepository(repoUrl) { ... }
 *   async function judgeSubmission(evidence) { ... }
 *   async function recommendTechnologies(requirements) { ... }
 *
 * Each of these will eventually call callLLM() internally with a
 * carefully engineered prompt for that specific job.
 * ------------------------------------------------------------------ */

module.exports = {
  callLLM,
};