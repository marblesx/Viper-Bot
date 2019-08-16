const mlb = require('./mlb/mlb');
const misc = require('./miscellaneous/miscellaneous');
const softball = require('./softball/softball');
const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const https = require('https');

let startTime;

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
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
    startTime = new Date();

});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    console.log(message);
    if (message.includes(bot.id)){

        bot.sendMessage({
            to: channelID,
            message: 'Sorry <@'+ userID +'> I\'m just here for sports and dick pics'
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
                case 'sb':
                    softball.softballMethods(args, bot, channelID);
                    break;
                case 'rock':
                    bot.sendMessage({
                        to: channelID,
                        message: misc.RockPaperScissors('rock',userID)
                    });
                case 'scissors':
                    bot.sendMessage({
                        to: channelID,
                        message: misc.RockPaperScissors('scissors',userID)
                    });
                case 'paper':
                    bot.sendMessage({
                        to: channelID,
                        message: misc.RockPaperScissors('paper',userID)
                    });
                case '8ball':
                    bot.sendMessage({
                        to: channelID,
                        message: misc.eightBall()
                    });
                case 'uptime':
                    bot.sendMessage({
                        to: channelID,
                        message:  Math.abs(new Date() - startTime) / 36e5
                    });

            }
        }
});
