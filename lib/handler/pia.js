const COMMAND = 'pia'
const CONFIG = require('../../config.js');

// from vjudge1/seijabot-irc
const PIA = ['(╯‵△′)╯ ┻━┻ ', ' (╯°Д°)╯︵ ~~~~~┻━┻ ', '(ノ=Д=)ノ~~~┻━┻ ',
    '（/0口0）/┸-~~~~┸ ', '（/>///<）/~~~~~~~~`╧═╧ )',
    '(ノ—_—)ノ~~~~┴————┴ ', '（/0口0）/┸-~~~~┸ '];

// from vjudge1/seijabot-irc
const QAQ = ['QAQ', '╮(－_－)╭', '= =b', '(ﾟДﾟ≡ﾟДﾟ)?'];

function random(array) {
    return array[parseInt(Math.random() * array.length)];
}

var attachTo = function(bot) {
    bot.onText(new RegExp(`^/${COMMAND}(?:@${CONFIG.TG_BOT_NAME})? *(.*)`, "i"), (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        
        var piaObject = match[1];
        if (piaObject == '') {
            bot.sendMessage(chatId, random(QAQ));
        } else if (piaObject == '@' + CONFIG.TG_BOT_NAME) {
            bot.sendMessage(chatId, random(PIA) + '@' + msg.from.username);
        } else {
            bot.sendMessage(chatId, random(PIA) + piaObject);
        }
    });
}

module.exports = {
    attachTo
}
