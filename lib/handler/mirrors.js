const COMMAND = 'mirrors'
const CONFIG = require('../../config.js');

var fs = require('fs');

function generateAPTString(os, version, callback) {
    let title = '*' + os + ' ' + version + ':*';
    let help = '将以下内容替换`/etc/apt/sources.list`的内容，然后执行`apt update`';
    if (os === 'ubuntu') {
        fs.readFile('./lib/handler/mirrors_template/apt', (err, buffer) => {
            if (err) {
                throw err;
            }
            let mirrors = '```\n' + buffer.toString().replace(/\${os}/g, os).replace(/\${version}/g, version) + '\n```';
            callback(title + '\n' + help + '\n\n' + mirrors);
        });
    } else if (os === 'debian') {
        fs.readFile('./lib/handler/mirrors_template/debian-' + version, (err, buffer) => {
            if (err) {
                throw err;
            }
            let mirrors = '```\n' + buffer.toString() + '\n```';
            callback(title + '\n' + help + '\n\n' + mirrors);
        });
    }
}

function generateCentOSString(version, callback) {
    let title = '*CentOS ' + version + ':*';
    let help = '将以下内容替换`/etc/yum.repos.d/CentOS-Base.repo`中的内容, 然后运行`yum makecache`生成缓存';
    fs.readFile('./lib/handler/mirrors_template/centos', (err, buffer) => {
        if (err) {
            throw err;
        }
        let mirrors = '```\n' + buffer.toString().replace(/\${version}/g, version) + '\n```';
        callback(title + '\n' + help + '\n\n' + mirrors);
    });
}

function generateEpelString(version, callback) {
    let title = '*Epel ' + version + ':*';
    let help = '将以下内容替换`/etc/yum.repos.d/epel.repo`中的内容';
    let helpTesting = '将以下内容替换`/etc/yum.repos.d/epel-testing.repo`中的内容，然后运行yum makecache生成缓存';
    fs.readFile('./lib/handler/mirrors_template/epel', (err, buffer) => {
        if (err) {
            throw err;
        }
        let mirrors = '```\n' + buffer.toString().replace(/\${version}/g, version) + '\n```';
        fs.readFile('./lib/handler/mirrors_template/epel-testing', (errTesting, bufferTesting) => {
            if (errTesting) {
                throw errTesting;
            }
            let mirrorsTesting = '```\n' + bufferTesting.toString().replace(/\${version}/g, version) + '\n```';
            callback(title + '\n' + help + '\n\n' + mirrors + '\n\n' + helpTesting + '\n\n' + mirrorsTesting);
        });
    });
}

function generateArchlinuxString(callback) {
    let title = '*Arch Linux:*';
    let help = '将以下内容替换`/etc/pacman.d/mirrorlist`中的内容，然后使用`sudo pacman -Syy`更新软件包缓存';
    let mirrors = '`Server = http://mirrors.cqupt.edu.cn/archlinux/$repo/os/$arch`';
    callback(title + '\n' + help + '\n\n' + mirrors);
}

function generateArchlinuxCNString(callback) {
    let title = '*Arch Linux - CN:*'
    let help = '在`/etc/pacman.conf`文件末尾添加以下内容，然后安装`archlinuxcn-keyring`包导入 GPG key';
    fs.readFile('./lib/handler/mirrors_template/archlinuxcn', (err, data) => {
        if (err) {
            throw err;
        }
        let mirrors = '```\n' + data + '\n```';
        callback(title + '\n' + help + '\n\n' + mirrors);
    });
}

function InlineKeyboardButton(text, callback_data) {
    this.text = text;
    this.callback_data = callback_data;
}

function onUnknownOS(chatId, messageId, bot) {
    let help = '请选择发行版';
    bot.sendMessage(chatId, help, {reply_to_message_id: messageId, reply_markup: {
        inline_keyboard: [
            [new InlineKeyboardButton('Ubuntu', 'mirrors-ubuntu')], 
            [new InlineKeyboardButton('Debian', 'mirrors-debian')], 
            [new InlineKeyboardButton('CentOS', 'mirrors-centos'), new InlineKeyboardButton('Epel', 'mirrors-epel')], 
            [new InlineKeyboardButton('Arch Linux', 'mirrors-archlinux'), new InlineKeyboardButton('Arch Linux CN', 'mirrors-archlinuxcn')]
        ]
    }});
}

function onUbuntu(queryData, bot, originMessage) {
    let query = queryData.replace(/^mirrors-ubuntu-*/, '');
    switch (query) {
        case '':
            let help = '请选择Ubuntu版本';
            bot.editMessageText(help, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, reply_markup: {
                inline_keyboard: [
                    [new InlineKeyboardButton('Precise (12.04)', 'mirrors-ubuntu-precise')],
                    [new InlineKeyboardButton('Trusty (14.04)', 'mirrors-ubuntu-trusty')],
                    [new InlineKeyboardButton('Xenial (16.04)', 'mirrors-ubuntu-xenial')]
                ]
            }});
            break;
        case 'precise':
        case 'trusty':
        case 'xenial':
            generateAPTString('ubuntu', query, (mirrorsHelpString) => {
                bot.editMessageText(mirrorsHelpString, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, parse_mode: "Markdown"});
            });
    }
}

function onDebian(queryData, bot, originMessage) {
    let query = queryData.replace(/^mirrors-debian-*/, '');
    switch (query) {
        case '':
            let help = '请选择Debian版本';
            bot.editMessageText(help, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, reply_markup: {
                inline_keyboard: [
                    [new InlineKeyboardButton('jessie (stable)', 'mirrors-debian-jessie')],
                    [new InlineKeyboardButton('wheezy (oldstable)', 'mirrors-debian-wheezy')],
                    [new InlineKeyboardButton('stretch (testing)', 'mirrors-debian-stretch')],
                    [new InlineKeyboardButton('sid (unstable)', 'mirrors-debian-sid')]
                ]
            }});
            break;
        case 'jessie':
        case 'wheezy':
        case 'stretch':
        case 'sid':
            generateAPTString('debian', query, (mirrorsHelpString) => {
                bot.editMessageText(mirrorsHelpString, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, parse_mode: "Markdown"});
            });
    }
}

function onCentOS(queryData, bot, originMessage) {
    let query = queryData.replace(/^mirrors-centos-*/, '');
    switch (query) {
        case '':
            let help = '请选择CentOS版本';
            bot.editMessageText(help, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, reply_markup: {
                inline_keyboard: [[
                    new InlineKeyboardButton('5', 'mirrors-centos-5'),
                    new InlineKeyboardButton('6', 'mirrors-centos-6'),
                    new InlineKeyboardButton('7', 'mirrors-centos-7')
                ]]
            }});
            break;
        case '5':
        case '6':
        case '7':
            generateCentOSString(query, (mirrorsHelpString) => {
                bot.editMessageText(mirrorsHelpString, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, parse_mode: "Markdown"});
            });
    }
}

function onEpel(queryData, bot, originMessage) {
    let query = queryData.replace(/^mirrors-epel-*/, '');
    switch (query) {
        case '':
            let help = '请选择Epel版本';
            bot.editMessageText(help, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, reply_markup: {
                inline_keyboard: [[
                    new InlineKeyboardButton('5', 'mirrors-epel-5'),
                    new InlineKeyboardButton('6', 'mirrors-epel-6'),
                    new InlineKeyboardButton('7', 'mirrors-epel-7')
                ]]
            }});
            break;
        case '5':
        case '6':
        case '7':
            generateEpelString(query, (mirrorsHelpString) => {
                bot.editMessageText(mirrorsHelpString, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, parse_mode: "Markdown"});
            });
    }
}

function onArchlinux(queryData, bot, originMessage) {
    generateArchlinuxString((mirrorsHelpString) => {
        bot.editMessageText(mirrorsHelpString, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, parse_mode: "Markdown"});
    })
}

function onArchlinuxCN(queryData, bot, originMessage) {
    generateArchlinuxCNString((mirrorsHelpString) => {
        bot.editMessageText(mirrorsHelpString, {chat_id: originMessage.chat.id, message_id: originMessage.message_id, parse_mode: "Markdown"});
    })
}

var attachTo = function(bot) {
    bot.onText(new RegExp(`^/${COMMAND}(?:@${CONFIG.TG_BOT_NAME})?`, "i"), (msg, match) => {
        const chatId = msg.chat.id;
        const messageId = msg.message_id;
        onUnknownOS(chatId, messageId, bot);
    });
    bot.on('callback_query', (query) => {
        if (query.data.match(/^mirrors-ubuntu.*/)) {
            onUbuntu(query.data, bot, query.message);
        }else if (query.data.match(/^mirrors-debian.*/)) {
            onDebian(query.data, bot, query.message);
        } else if (query.data.match(/^mirrors-centos.*/)) {
            onCentOS(query.data, bot, query.message);
        } else if (query.data.match(/^mirrors-epel.*/)) {
            onEpel(query.data, bot, query.message);
        } else if (query.data.match(/^mirrors-archlinux$/)) {
            onArchlinux(query.data, bot, query.message);
        } else if (query.data.match(/^mirrors-archlinuxcn$/)) {
            onArchlinuxCN(query.data, bot, query.message);
        }
    });
}

module.exports = {
    attachTo
}
