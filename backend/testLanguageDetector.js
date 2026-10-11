
const { detectLanguage } = require("./languageDetector");

const files = [
    "app.js",
    "main.py",
    "server.go",
    "Main.java",
    "index.html",
    "style.css",
    "unknown.xyz",
    "image.png",
    "Dockerfile"
];

for (const file of files) {
    try {
        console.log(`${file} -> ${detectLanguage(file)}`);
    } catch (error) {
        console.log(`${file} -> Detection failed: ${error.message}`);
    }
}
