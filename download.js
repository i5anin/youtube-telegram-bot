const fs = require('fs');
const path = require('path');
const ytdl = require('ytdl-core');
const ffmpegPath = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');

ffmpeg.setFfmpegPath(ffmpegPath);

function downloadYoutubeVideo(url) {
    return new Promise((resolve, reject) => {
        const outputPath = path.join(__dirname, 'tmp', `video-${Date.now()}.mp4`);

        const videoStream = ytdl(url, { quality: '18' }); // 360p .mp4
        ffmpeg(videoStream)
            .videoCodec('libx264')
            .format('mp4')
            .on('end', () => resolve(outputPath))
            .on('error', reject)
            .save(outputPath);
    });
}

module.exports = { downloadYoutubeVideo };
