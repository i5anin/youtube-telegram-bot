const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

function downloadWithYtDlp(url) {
    return new Promise((resolve, reject) => {
        const outputDir = path.join(__dirname, 'tmp');
        const fileName = `video-${Date.now()}.mp4`;
        const outputPath = path.join(outputDir, fileName);

        const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp.exe');

        const command = `"${ytDlpPath}" -f 18 -o "${outputPath}" "${url}"`;
        console.log(`[YTDLP] Команда: ${command}`);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`[YTDLP ERROR]`, error);
                return reject(error);
            }
            console.log(`[YTDLP] Успешно:`, stdout);
            resolve(outputPath);
        });
    });
}

module.exports = { downloadWithYtDlp };
