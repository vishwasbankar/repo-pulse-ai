
const generateLanguageStatistics = require("./languageStatistics");

const languageCounts = {
    JavaScript: 40,
    Python: 25,
    TypeScript: 15,
    HTML: 10,
    CSS: 10
};

const totalValidFiles = 120;

try {
    const report = generateLanguageStatistics(
        languageCounts,
        totalValidFiles
    );

    console.log("\n=== RepoPulse AI Language Statistics ===\n");
    console.log("Total Valid Files:", report.totalValidFiles);
    console.log("Recognized Files:", report.recognizedFiles);
    console.log("Unrecognized Files:", report.unrecognizedFiles);

    console.log("\nLanguage-wise Distribution:\n");

    for (const [language, stats] of Object.entries(report.languages)) {
        console.log(
            `${language}: ${stats.files} files (${stats.percentage}%)`
        );
    }

    console.log("\nComplete Statistics Report:\n");
    console.log(JSON.stringify(report, null, 2));
} catch (error) {
    console.error("Error:", error.message);
}
