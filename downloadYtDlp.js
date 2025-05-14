const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

function downloadWithYtDlp(url) {
    return new Promise((resolve, reject) => {
        const outputDir = path.join(__dirname, 'tmp');
        const fileName = `video-${Date.now()}.mp4`;
        const outputPath = path.join(outputDir, fileName);
        const ytDlpPath = path.join(__dirname, 'bin/yt-dlp.exe');

        console.log(`[YTDLP] Старт скачивания в: ${outputPath}`);

        const child = spawn(ytDlpPath, ['-f', '18', '-o', outputPath, url]);

        child.stdout.on('data', data => process.stdout.write(`[yt-dlp] ${data}`));
        child.stderr.on('data', data => process.stderr.write(`[yt-dlp ERR] ${data}`));

        child.on('close', code => {
            if (code === 0) {
                const { size } = fs.statSync(outputPath);
                resolve({ outputPath, size });
            } else {
                reject(new Error(`yt-dlp завершился с кодом ${code}`));
            }
        });
    });
}

module.exports = { downloadWithYtDlp };
