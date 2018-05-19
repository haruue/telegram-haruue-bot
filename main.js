const TelegramBot = require('node-telegram-bot-api'); 
const CONFIG = require('./config.js');

// replace the value below with the Telegram token you receive from @BotFather 
const token = CONFIG.TG_BOT_TOKEN; 

// Create a bot that uses 'polling' to fetch new updates 
const bot = new TelegramBot(token, {polling: true}); 

require('./lib/handler/bash.js').attachTo(bot);
require('./lib/handler/echo.js').attachTo(bot);
require('./lib/handler/cquptlife.js').attachTo(bot);
require('./lib/handler/mirrors.js').attachTo(bot);
require('./lib/handler/pia.js').attachTo(bot);
require('./lib/handler/eval.js').attachTo(bot);
require('./lib/handler/html.js').attachTo(bot);
require('./lib/handler/ping.js').attachTo(bot);

// Listen for any kind of message. There are different kinds of
// messages.
bot.on('message', (msg) => {
    console.log(`${msg.from.username}(uid:${msg.from.id},cid:${msg.chat.id}): ${msg.text}`);
});
