const COMMAND = 'ping'
const CONFIG = require('../../config.js');

var attachTo = function(bot) {
    bot.onText(new RegExp(`^/${COMMAND}(@${CONFIG.TG_BOT_NAME})?.*`, "i"), (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        if (chatId >= 0 || match[1]) {
            bot.sendMessage(chatId, 'pong', {reply_to_message_id: msg.message_id});
        }
    });
}

module.exports = {
    attachTo
}
