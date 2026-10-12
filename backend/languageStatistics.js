
function generateLanguageStatistics(languageCounts, totalValidFiles) {
    if (
        !languageCounts ||
        typeof languageCounts !== "object" ||
        Array.isArray(languageCounts)
    ) {
        throw new TypeError("Invalid language counts");
    }

    if (!Number.isInteger(totalValidFiles) || totalValidFiles < 0) {
        throw new TypeError("Invalid total valid files");
    }

    const languages = {};

    for (const [language, count] of Object.entries(languageCounts)) {
        if (!Number.isInteger(count) || count < 0) {
            throw new TypeError(`Invalid count for ${language}`);
        }

        languages[language] = {
            files: count,
            percentage: totalValidFiles === 0
                ? 0
                : Number(((count / totalValidFiles) * 100).toFixed(2))
        };
    }

    const recognizedFiles = Object.values(languageCounts)
        .reduce((sum, count) => sum + count, 0);

    if (recognizedFiles > totalValidFiles) {
        throw new Error(
            "Recognized files cannot exceed total valid files"
        );
    }

    return {
        totalValidFiles,
        recognizedFiles,
        unrecognizedFiles: totalValidFiles - recognizedFiles,
        languages
    };
}

module.exports = generateLanguageStatistics;
