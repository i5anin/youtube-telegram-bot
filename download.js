const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

function downloadYoutubeVideo(url) {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(__dirname, 'tmp', `video-${Date.now()}.mp4`);
        console.log(`[DL] Начинаю скачивание: ${url}`);
        console.log(`[DL] Сохраняю в: ${outputPath}`);

        const videoStream = ytdl(url, {
            quality: '18',
            requestOptions: {
                headers: {
                    // симуляция мобильного клиента, иногда помогает
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; Mobile; rv:68.0) Gecko/68.0 Firefox/68.0'
                }
            },
            highWaterMark: 1 << 25 // 32MB
        });


        videoStream.on('info', (info) => {
            console.log(`[DL] Видео: ${info.videoDetails.title}`);
        });

        videoStream.on('progress', (chunkLength, downloaded, total) => {
            const percent = ((downloaded / total) * 100).toFixed(2);
            process.stdout.write(`\r[DL] Загрузка: ${percent}%`);
        });

        ffmpeg(videoStream)
            .videoCodec('libx264')
            .format('mp4')
            .on('start', cmd => console.log(`\n[FFMPEG] Команда: ${cmd}`))
            .on('end', () => {
                console.log(`\n[FFMPEG] Завершено`);
                resolve(outputPath);
            })
            .on('error', err => {
                console.error(`[FFMPEG ERROR]`, err);
                reject(err);
            })
            .save(outputPath);
    });
}

module.exports = { downloadYoutubeVideo };
