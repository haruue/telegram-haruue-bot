const COMMAND = 'cquptlife'
const CONFIG = require('../../config.js');

var request = require('request');

var attachTo = function(bot) {
    bot.onText(new RegExp(`^/${COMMAND}(?:@${CONFIG.TG_BOT_NAME})? (.+)`, "i"), (msg, match) => {
        const chatId = msg.chat.id;
        const userId = msg.from.id;
        var searchKey = match[1];

        if (CONFIG.OWNERS_ID.indexOf(userId) > -1 ||
            CONFIG.POWERUSERS_ID.indexOf(userId) > -1) {
            request({
                url: 'http://jwzx.host.congm.in:88/jwzxtmp/data/json_StudentSearch.php?searchKey=' + encodeURIComponent(searchKey),
                headers: {
                    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.100 Safari/537.36'
                }
            }, (error, response, body) => {
                var info = JSON.parse(body).returnData;
                if (info.length <= 0) {
                    return '无匹配项';
                }
                var result = '';
                result += '------------------------------\n';
                for (var i = 0; i < info.length; i++) {
                    let s = info[i];
                    result += `${s.xm} ${s.xb}\n`;
                    result += `学号: ${s.xh}\n`;
                    result += `${s.yxm} ${s.zym}\n`;
                    result += `${s.nj.replace(' ', '')} 级 ${s.bj} 班\n`;
                    result += '------------------------------\n';
                    if (i >= 2) {
                        result += '只显示 3 个最接近的匹配';
                        break;
                    }
                }
                bot.sendMessage(chatId, result);
            });
        }
    });
}

module.exports = {
    attachTo
}
