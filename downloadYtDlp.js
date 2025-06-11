const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

function downloadWithYtDlp(url) {
    return new Promise((resolve, reject) => {
        const outputDir = path.join(__dirname, 'tmp');
        const fileName = `video-${Date.now()}.mp4`;
        const outputPath = path.join(outputDir, fileName);
        const ytDlpPath = path.join(__dirname, 'bin/yt-dlp.exe'); // путь к твоему .exe

        if (!fs.existsSync(ytDlpPath)) {
            return reject(new Error(`yt-dlp.exe не найден: ${ytDlpPath}`));
        }

        console.log(`[YTDLP] Старт скачивания в: ${outputPath}`);

        const args = [
            '--proxy', 'socks5://127.0.0.1:9050', // 💡 TOR-прокси
            '--no-check-certificate',
            '--geo-bypass',
            '-f', 'best[filesize<49M]',
            '-o', outputPath,
            url
        ];

        const child = spawn(ytDlpPath, args);

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

        child.on('error', err => {
            reject(new Error(`Ошибка запуска yt-dlp: ${err.message}`));
        });
    });
}

module.exports = { downloadWithYtDlp };
