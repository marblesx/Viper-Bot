const mlb = require('./mlb/mlb');
const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const https = require('https');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
    //mlb.philliesLive(bot, '');

});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split('.');
        var cmd = args[0];
        let toSend = '';
        console.log('Command from: ' + user);
        if (message.isMentioned(bot.user)) {
            message.reply('Sorry I\'m just here for sports and dick pics');
        }
        else {
            switch (cmd.toLowerCase()) {
                case 'ping':
                    console.log(channelID);
                    bot.sendMessage({
                        to: channelID,
                        message: 'Pong!'
                    });
                    break;
                case 'mlb':
                    mlb.mlbMethods(args, bot, channelID);
                    break;
            }
        }
    }
});
