const ytdl = require('ytdl-core');

const url = 'https://youtu.be/q6w9KiI8URo';

ytdl.getInfo(url)
    .then(info => {
        console.log('✅ Название:', info.videoDetails.title);
        console.log('📺 Длительность:', info.videoDetails.lengthSeconds, 'секунд');
        console.log('🎞️ Доступные форматы:');
        info.formats.forEach(f => {
            console.log(` - ${f.mimeType} [${f.qualityLabel || 'аудио'}]`);
        });
    })
    .catch(err => {
        console.error('❌ Ошибка получения информации:', err.message);
    });
