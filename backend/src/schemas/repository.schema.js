/**
 * backend/src/schemas/repository.schema.js
 *
 * FOUNDATION ONLY — Sprint 2.
 *
 * Defines the "AI-ready" shape that raw repository data must be
 * converted into before any future AI step (summarization, judging,
 * recommendations) is allowed to touch it.
 *
 * This file does NOT call an LLM and does NOT score anything.
 * It only describes the shape of the data and validates it.
 */

// Human-readable schema description (kept as plain JS so it's easy to
// read without needing a JSON Schema library). A stricter JSON Schema
// (draft-07) version can be layered on top later with a tool like
// `ajv` once the shape below has stabilized.
const AI_READY_SCHEMA = {
  repository: {
    name: 'string',
    url: 'string',
    description: 'string',
    primaryLanguage: 'string',
    languages: 'object',       // e.g. { "JavaScript": 72.4, "CSS": 12.1 }
    topics: 'array',
    license: 'string|null',
  },
  team: {
    contributors: 'array',     // [{ username, commitCount }]
    totalCommits: 'number',
    firstCommitAt: 'string',   // ISO date
    lastCommitAt: 'string',    // ISO date
  },
  documentation: {
    hasReadme: 'boolean',
    readmeSummary: 'string',
    hasSetupInstructions: 'boolean',
    hasDemoLink: 'boolean',
    demoUrl: 'string|null',
  },
  techStack: {
    frameworks: 'array',
    dependencies: 'array',
    hasTests: 'boolean',
    hasCI: 'boolean',
  },
  evidence: 'array', // see validateEvidence() below for item shape
};

/**
 * Every "evidence" entry backs up a future AI claim with something
 * traceable — a real file, commit, or line — instead of a vague
 * impression. This is what lets Sprint 3+ judging cite its sources
 * instead of hallucinating them.
 *
 *   {
 *     id: "ev_01",
 *     type: "readme" | "commit" | "file" | "test" | "ci" | "dependency",
 *     source: "README.md" | commit sha | file path,
 *     claim: "One short, factual sentence."
 *   }
 */
function validateEvidenceItem(item, index, errors) {
  const allowedTypes = ['readme', 'commit', 'file', 'test', 'ci', 'dependency'];
  const path = `evidence[${index}]`;

  if (typeof item !== 'object' || item === null) {
    errors.push(`${path} must be an object`);
    return;
  }
  if (typeof item.id !== 'string' || !item.id) {
    errors.push(`${path}.id must be a non-empty string`);
  }
  if (!allowedTypes.includes(item.type)) {
    errors.push(`${path}.type must be one of: ${allowedTypes.join(', ')}`);
  }
  if (typeof item.source !== 'string' || !item.source) {
    errors.push(`${path}.source must be a non-empty string`);
  }
  if (typeof item.claim !== 'string' || !item.claim) {
    errors.push(`${path}.claim must be a non-empty string`);
  }
}

/**
 * Validates a candidate object against AI_READY_SCHEMA.
 * Returns { valid: boolean, errors: string[] }.
 * No external dependencies — safe to run anywhere Node.js runs.
 */
function validateRepositoryData(data) {
  const errors = [];

  if (typeof data !== 'object' || data === null) {
    return { valid: false, errors: ['Input must be an object'] };
  }

  const requiredTopLevel = ['repository', 'team', 'documentation', 'techStack', 'evidence'];
  for (const key of requiredTopLevel) {
    if (!(key in data)) {
      errors.push(`Missing top-level key: "${key}"`);
    }
  }

  if (data.repository) {
    if (typeof data.repository.name !== 'string' || !data.repository.name) {
      errors.push('repository.name must be a non-empty string');
    }
    if (typeof data.repository.url !== 'string' || !/^https?:\/\//.test(data.repository.url)) {
      errors.push('repository.url must be a valid http(s) URL');
    }
  }

  if (data.team) {
    if (!Array.isArray(data.team.contributors)) {
      errors.push('team.contributors must be an array');
    }
    if (typeof data.team.totalCommits !== 'number') {
      errors.push('team.totalCommits must be a number');
    }
  }

  if (!Array.isArray(data.evidence)) {
    errors.push('evidence must be an array');
  } else {
    if (data.evidence.length === 0) {
      errors.push('evidence must contain at least one item');
    }
    data.evidence.forEach((item, i) => validateEvidenceItem(item, i, errors));
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { AI_READY_SCHEMA, validateRepositoryData };