require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { downloadWithYtDlp } = require('./downloadYtDlp');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
    console.log(`[START] Пользователь ${msg.from.username} начал работу`);
    bot.sendMessage(msg.chat.id, 'Пришли мне ссылку на YouTube-видео, и я скачаю его для тебя.');
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text?.startsWith('https://www.youtube.com/') || text?.startsWith('https://youtu.be/')) {
        console.log(`[LINK] Получена ссылка: ${text}`);
        bot.sendMessage(chatId, 'Скачиваю видео, подожди...');
        try {
            const filePath = await downloadWithYtDlp(text);
            console.log(`[SEND] Отправляю видео: ${filePath}`);
            await bot.sendVideo(chatId, filePath);
        } catch (error) {
            console.error(`[ERROR]`, error);
            bot.sendMessage(chatId, 'Ошибка при скачивании видео: ' + error.message);
        }
    }
});
