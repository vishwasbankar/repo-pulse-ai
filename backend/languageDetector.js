
const path = require("path");
const languages = require("linguist-languages");

function detectLanguage(filePath) {
    const fileName = path.basename(filePath);
    const extension = path.extname(fileName).toLowerCase();

    // Handle special filenames such as Dockerfile
    const specialFiles = Object.values(languages).find(
        (language) =>
            language.filenames &&
            language.filenames.some(
                (name) => name.toLowerCase() === fileName.toLowerCase()
            )
    );

    if (specialFiles) {
        return specialFiles.name;
    }

    // Identify language by extension
    const matches = Object.values(languages).filter(
        (language) =>
            language.type === "programming" &&
            language.extensions &&
            language.extensions.some(
                (ext) => ext.toLowerCase() === extension
            )
    );

    if (matches.length === 1) {
        return matches[0].name;
    }

    if (matches.length > 1) {
        return "Ambiguous";
    }

    return "Other";
}

module.exports = { detectLanguage };
