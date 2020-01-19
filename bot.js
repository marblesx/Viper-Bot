const softball = require('./softball/softball');
const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const {prefix} = require('./config.json');
const clientCommands = {};
const fs = require('fs');
const commandFiles = fs.readdirSync('commands').filter(file => file.endsWith('.js'));

let startTime;

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log(command);
    // set a new item in the Collection
    // with the key as the command name and the value as the exported module
    clientCommands[command.name] = command;
}



// Configure logger settings
logger.remove(logger.transports.Console);

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
    if (message.includes(bot.id)) {

        bot.sendMessage({
            to: channelID,
            message: 'Sorry <@' + userID + '> I\'m just here for sports and dick pics'
        });
    } else if (message.substring(0, 1) === prefix) {

        let args = message.substring(1).split('.');
        let cmd = args[0];
        if (cmd.toLowerCase().startsWith('8ball')) {
            cmd = '8Ball';
        }
        if (!clientCommands[cmd]) return;

        try {
            clientCommands[cmd].execute(args, bot, channelID, userID);
        } catch (error) {
            console.error(error);
            bot.sendMessage({
                to: channelID,
                message: 'ah crap we screwed up.'
            });
        }
    }
});

