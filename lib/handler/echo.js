const COMMAND = 'echo'
const CONFIG = require('../../config.js');

var attachTo = function(bot) {
    bot.onText(new RegExp(`/${COMMAND}(?:@${CONFIG.TG_BOT_NAME})? (.+)`, "i"), (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        var resp = match[1];

        if (CONFIG.OWNERS_ID.indexOf(userId) <= -1) {
            resp = `${msg.from.username}: ${resp}`;
        }
        bot.sendMessage(chatId, resp);
    });
}

module.exports = {
    attachTo
}
