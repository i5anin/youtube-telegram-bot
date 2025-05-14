require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { downloadWithYtDlp } = require('./downloadYtDlp');
const fs = require('fs');

const MAX_TELEGRAM_FILE_SIZE = 49 * 1024 * 1024;
const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Пришли мне ссылку на YouTube-видео, и я скачаю его для тебя.');
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text?.startsWith('https://')) {
        bot.sendMessage(chatId, 'Скачиваю видео, подожди...');
        try {
            const { outputPath, size } = await downloadWithYtDlp(text);
            console.log(`[SEND] Размер файла: ${(size / 1024 / 1024).toFixed(2)} MB`);

            if (size < MAX_TELEGRAM_FILE_SIZE) {
                await bot.sendVideo(chatId, outputPath);
            } else {
                await bot.sendMessage(chatId, '❌ Видео слишком большое для Telegram (>50MB).');
            }

            fs.unlinkSync(outputPath); // Удаляем временный файл
        } catch (error) {
            console.error('[ERROR]', error);
            bot.sendMessage(chatId, 'Ошибка при скачивании видео: ' + error.message);
        }
    }
});
