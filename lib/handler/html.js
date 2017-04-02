const CONFIG = require('../../config.js');

var crypto = require('crypto');

function md5sum(text) {
  return crypto.createHash('md5').update(text).digest('hex');
};

function generateQueryResult(queryString) {
    let results = [];
    results.push({
        type: 'article',
        id: md5sum('HTML' + queryString),
        title: 'Format as HTML',
        input_message_content: {
            message_text: queryString,
            parse_mode: 'HTML'
        }
    });
    return results;
}


var attachTo = function(bot) {
    bot.on('inline_query', (query) => {
        if (query.query != '') {
            bot.answerInlineQuery(query.id, generateQueryResult(query.query)).catch((error) => {
                // ignore parse error when html is incomplete
            });
        }
    });
}

module.exports = {
    attachTo
}
