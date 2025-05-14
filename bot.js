require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { downloadYoutubeVideo } = require('./download');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Пришли мне ссылку на YouTube-видео, и я скачаю его для тебя.');
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text?.startsWith('https://www.youtube.com/') || text?.startsWith('https://youtu.be/')) {
        bot.sendMessage(chatId, 'Скачиваю видео, подожди...');
        try {
            const filePath = await downloadYoutubeVideo(text);
            await bot.sendVideo(chatId, filePath);
        } catch (error) {
            bot.sendMessage(chatId, 'Ошибка при скачивании видео: ' + error.message);
        }
    }
});
