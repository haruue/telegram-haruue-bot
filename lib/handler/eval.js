const COMMAND = 'eval'
const CONFIG = require('../../config.js');

function evalAsync(exp, callback) {
    setTimeout(() => {
        var result = undefined;
        var error = null;
        try {
            result = eval(exp);
        } catch (e) {
            error = e;
        }
        callback(error, result);
    }, 0);
}

var attachTo = function(bot) {
    bot.onText(new RegExp(`/${COMMAND}(?:@${CONFIG.TG_BOT_NAME})? (.+)`, "i"), (msg, match) => {
        const chatId = msg.chat.id;
        const exp = match[1]; 
        const userId = msg.from.id;

        if (CONFIG.OWNERS_ID.indexOf(userId) > -1) {
            evalAsync(exp, (error, result) => {
                var resp = "```\n";
                resp += result;
                resp += "\n```";
                if (error != null) {
                    resp += "\nError occurred: " + error;
                }
                bot.sendMessage(chatId, resp, {parse_mode: "Markdown", reply_to_message_id: msg.message_id});
            });
        }
    });
}

module.exports = {
    attachTo
}
