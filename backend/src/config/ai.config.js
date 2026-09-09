/**
 * backend/src/config/ai.config.js
 *
 * Central place where AI-related settings are read from environment
 * variables. Nothing in this file is ever hard-coded — every secret
 * or setting comes from process.env, which is populated from a local
 * .env file (via `dotenv`) in development, and from real environment
 * variables in staging/production.
 *
 * This file does NOT talk to any LLM. It only prepares configuration
 * for ai.service.js to use.
 */

require('dotenv').config();

const SUPPORTED_PROVIDERS = ['gemini', 'openai'];

// Which provider is active. Defaults to "gemini" if not set.
const provider = (process.env.AI_PROVIDER || 'gemini').toLowerCase();

if (!SUPPORTED_PROVIDERS.includes(provider)) {
  throw new Error(
    `Unsupported AI_PROVIDER "${provider}". Use one of: ${SUPPORTED_PROVIDERS.join(', ')}`
  );
}

const config = {
  provider,

  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },
};

/**
 * Throws a clear, actionable error if the active provider's API key
 * is missing. Call this before making any real API call.
 */
function validateConfig() {
  const active = config[config.provider];

  if (!active || !active.apiKey) {
    throw new Error(
      `Missing API key for provider "${config.provider}". ` +
      `Set ${config.provider.toUpperCase()}_API_KEY in your .env file ` +
      `(see .env.example).`
    );
  }
}

module.exports = { config, validateConfig };