/**
 * backend/src/services/documentationAnalysis.service.js
 *
 * Sprint 3 — "AI/ML member: Documentation Analysis"
 *
 * Checks a repository's README for presence and a handful of concrete
 * completeness signals, turns that into a score, and returns
 * evidence-based findings — i.e. every point of the score is backed
 * by a traceable claim, never a vague impression.
 *
 * DEPENDENCIES (per the task spec):
 *   - "repository file list" — a list of the repo's top-level entries.
 *     For now this service builds that list itself with fs.readdirSync
 *     (see getFileList below). You can also pass one in directly via
 *     the `fileList` option, which is what you'd do once the team's
 *     shared repo-scanning step (Member 1 / Member 2's modules) is
 *     wired up to hand this service a ready-made list instead.
 *   - "agreed schema" — the output below is shaped to slot directly
 *     into the `documentation` block and `evidence` array defined in
 *     Sprint 2's repository.schema.js, so nothing downstream has to
 *     be reshaped.
 *
 * This service does NOT call an LLM. The scoring is rule-based and
 * deterministic on purpose — it's the evidence layer that any future
 * AI judge will read from, not a judgment itself.
 */

const fs = require('fs');
const path = require('path');

const README_NAMES = ['README.md', 'README.MD', 'Readme.md', 'readme.md', 'README', 'README.rst', 'README.txt'];

// ASSUMPTION: these weights are a reasonable starting point and sum to
// 100. If Vishwas / the team has an agreed point breakdown already,
// swap these five numbers — nothing else in this file needs to change.
const SCORE_WEIGHTS = {
  readmeExists: 30,
  hasDescription: 15,
  hasSetupInstructions: 20,
  hasUsageExamples: 15,
  hasDemoLink: 10,
  hasLicense: 10,
};

/**
 * Builds a shallow list of the repo's top-level entries.
 * Stand-in for the shared "repository file list" dependency.
 */
function getFileList(repoPath) {
  return fs.readdirSync(repoPath, { withFileTypes: true }).map((entry) => entry.name);
}

function findReadmeFile(repoPath, fileList) {
  return fileList.find((name) => README_NAMES.includes(name)) || null;
}

/**
 * @param {string} repoPath - path to the repository root
 * @param {{ fileList?: string[] }} [options]
 * @returns {{
 *   documentation: object,  // matches Sprint 2 schema's `documentation` block
 *   score: { value: number, max: number, percentage: number },
 *   evidence: object[],     // matches Sprint 2 schema's `evidence` item shape
 *   gaps: string[]
 * }}
 */
function analyzeDocumentation(repoPath, options = {}) {
  const fileList = options.fileList || getFileList(repoPath);
  const evidence = [];
  const gaps = [];
  let score = 0;
  let evidenceIdCounter = 1;
  const nextId = () => `doc_${String(evidenceIdCounter++).padStart(2, '0')}`;

  const readmeName = findReadmeFile(repoPath, fileList);

  if (!readmeName) {
    gaps.push('No README file found at the repository root.');
    return {
      documentation: {
        hasReadme: false,
        readmeSummary: '',
        hasSetupInstructions: false,
        hasDemoLink: false,
        demoUrl: null,
      },
      score: { value: 0, max: 100, percentage: 0 },
      evidence,
      gaps,
    };
  }

  score += SCORE_WEIGHTS.readmeExists;
  evidence.push({
    id: nextId(),
    type: 'readme',
    source: readmeName,
    claim: `Repository has a README file (${readmeName}).`,
  });

  const content = fs.readFileSync(path.join(repoPath, readmeName), 'utf8');
  const lower = content.toLowerCase();
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  // --- Description signal: a heading plus a reasonable amount of body text ---
  const hasHeading = /^#\s+\S/m.test(content);
  const hasDescription = hasHeading && wordCount >= 30;
  if (hasDescription) {
    score += SCORE_WEIGHTS.hasDescription;
    evidence.push({
      id: nextId(),
      type: 'readme',
      source: readmeName,
      claim: `README has a title heading and ${wordCount} words of content.`,
    });
  } else {
    gaps.push('README has little to no descriptive content (needs a heading and some explanatory text).');
  }

  // --- Setup / installation instructions ---
  const setupKeywords = ['install', 'setup', 'getting started', 'prerequisites', 'npm install', 'pip install'];
  const hasSetupInstructions = setupKeywords.some((kw) => lower.includes(kw));
  if (hasSetupInstructions) {
    score += SCORE_WEIGHTS.hasSetupInstructions;
    evidence.push({
      id: nextId(),
      type: 'readme',
      source: readmeName,
      claim: 'README includes setup/installation instructions.',
    });
  } else {
    gaps.push('No setup or installation instructions found in the README.');
  }

  // --- Usage / examples ---
  const usageKeywords = ['usage', 'example', '```'];
  const hasUsageExamples = usageKeywords.some((kw) => lower.includes(kw));
  if (hasUsageExamples) {
    score += SCORE_WEIGHTS.hasUsageExamples;
    evidence.push({
      id: nextId(),
      type: 'readme',
      source: readmeName,
      claim: 'README includes a usage section or code example.',
    });
  } else {
    gaps.push('No usage section or code example found in the README.');
  }

  // --- Demo / live link ---
  const demoLinkMatch = content.match(/https?:\/\/[^\s)]+/);
  const nearDemoWord = /demo|live|deployed|hosted/i.test(content);
  const hasDemoLink = Boolean(demoLinkMatch && nearDemoWord);
  const demoUrl = hasDemoLink ? demoLinkMatch[0] : null;
  if (hasDemoLink) {
    score += SCORE_WEIGHTS.hasDemoLink;
    evidence.push({
      id: nextId(),
      type: 'readme',
      source: readmeName,
      claim: `README links to a live demo (${demoUrl}).`,
    });
  } else {
    gaps.push('No demo/live link found in the README.');
  }

  // --- License file present in the repo ---
  const hasLicense = fileList.some((name) => /^license(\.(md|txt))?$/i.test(name));
  if (hasLicense) {
    score += SCORE_WEIGHTS.hasLicense;
    evidence.push({
      id: nextId(),
      type: 'file',
      source: fileList.find((name) => /^license(\.(md|txt))?$/i.test(name)),
      claim: 'Repository includes a LICENSE file.',
    });
  } else {
    gaps.push('No LICENSE file found in the repository.');
  }

  return {
    documentation: {
      hasReadme: true,
      readmeSummary: content.trim().split('\n').find((line) => line.trim().length > 0) || '',
      hasSetupInstructions,
      hasDemoLink,
      demoUrl,
    },
    score: {
      value: score,
      max: 100,
      percentage: Math.round((score / 100) * 100),
    },
    evidence,
    gaps,
  };
}

module.exports = { analyzeDocumentation };