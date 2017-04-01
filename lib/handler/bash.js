const COMMAND = 'bash'
const CONFIG = require('../../config.js');

var exec = require('child_process').exec;

var attachTo = function(bot) {
    bot.onText(new RegExp(`/${COMMAND}(?:@${CONFIG.TG_BOT_NAME})? (.+)`, "i"), (msg, match) => {
        const chatId = msg.chat.id;
        const bashCommand = match[1]; 
        const userId = msg.from.id;

        if (CONFIG.OWNERS_ID.indexOf(userId) > -1) {
            exec(bashCommand, (error, stdout, stderr) => {
                var resp = "```\n";
                resp += stdout;
                resp += "\n```";
                if (error != null) {
                    resp += "\nProcess finished with " + error;
                }
                bot.sendMessage(chatId, resp, {parse_mode: "Markdown", reply_to_message_id: msg.message_id});
            });
        }
    });
}

module.exports = {
    attachTo
}
