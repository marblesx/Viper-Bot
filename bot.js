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

});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    let mentioned = false;
    console.log(bot.user);
    console.log(message);
    if (message.includes(bot.id)){
                mentioned = true;
        }
    if (mentioned) {
        bot.sendMessage({
            to: channelID,
            message: 'Sorry '+ userID +' I\'m just here for sports and dick pics'
        });
    }
    else if (message.substring(0, 1) == '!') {
        let args = message.substring(1).split('.');
        let cmd = args[0];
        console.log('Command from: ' + user);
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
});
