const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function downloadWithYtDlp(url) {
    return new Promise((resolve, reject) => {
        const outputDir = path.join(__dirname, 'tmp');
        const fileName = `video-${Date.now()}.mp4`;
        const outputPath = path.join(outputDir, fileName);
        const ytDlpPath = path.join(__dirname, 'yt-dlp.exe');
        const command = `"${ytDlpPath}" -f 18 -o "${outputPath}" "${url}"`;

        console.log(`[YTDLP] Команда: ${command}`);

        exec(command, (error, stdout, stderr) => {
            if (error) return reject(error);
            console.log(`[YTDLP] Успешно:\n`, stdout);

            const { size } = fs.statSync(outputPath);
            resolve({ outputPath, size });
        });
    });
}

module.exports = { downloadWithYtDlp };
