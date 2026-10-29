function analyzeSecurity(files = []) {
  let score = 100;
  const findings = [];

  for (const file of files) {
    const content = file.content || "";
    const fileName = file.name || "";

    // Check for hardcoded secrets
    const secretPattern =
      /(api[_-]?key|secret|password|access[_-]?token)\s*[:=]\s*["'][^"']+["']/i;

    if (secretPattern.test(content)) {
      findings.push({
        severity: "HIGH",
        file: fileName,
        issue: "Possible hardcoded secret detected."
      });
    }

    // Check for dangerous code execution
    if (/\beval\s*\(/i.test(content)) {
      findings.push({
        severity: "HIGH",
        file: fileName,
        issue: "Use of eval() detected."
      });
    }

    // Check for disabled TLS certificate verification
    if (/rejectUnauthorized\s*:\s*false/i.test(content)) {
      findings.push({
        severity: "MEDIUM",
        file: fileName,
        issue: "TLS certificate verification appears disabled."
      });
    }
  }

  const highCount = findings.filter(
    (finding) => finding.severity === "HIGH"
  ).length;

  const mediumCount = findings.filter(
    (finding) => finding.severity === "MEDIUM"
  ).length;

  score = Math.max(0, 100 - highCount * 25 - mediumCount * 10);

  return {
    score,
    findings,
    summary:
      findings.length === 0
        ? "No known risky patterns detected by the basic security checks."
        : "Potential security issues detected. Review the findings."
  };
}

module.exports = {
  analyzeSecurity
};