const COMMAND = 'ping'
const CONFIG = require('../../config.js');

var attachTo = function(bot) {
    bot.onText(new RegExp(`^/${COMMAND}(?:@${CONFIG.TG_BOT_NAME}).*`, "i"), (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;

        bot.sendMessage(chatId, 'pong', {reply_to_message_id: msg.message_id});
    });
}

module.exports = {
    attachTo
}
