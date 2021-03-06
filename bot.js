const Discord = require('discord.js');
const logger = require('winston');
const {token} = require('./auth.json');
const {prefix, channelName} = require('./config.json');
const clientCommands = {};
const commands = [];
const fs = require('fs');
const commandFiles = fs.readdirSync('commands').filter(file => file.endsWith('.js'));
const commandRegex = /[!]\d+[d]\d+/g;
const digitsRegex = /\d+/g;
const serverCommand = require('./Common/serverCommon');

let startTime;

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
        // set a new item in the Collection
        // with the key as the command name and the value as the exported module
        clientCommands[command.name.toLowerCase()] = command;
        commands.push(command);
}
// Configure logger settings
logger.remove(logger.transports.Console);

logger.level = 'debug';
// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', ()=> {
    startTime = new Date();
    console.log(`Back online! ${startTime.toLocaleTimeString()}`);

});

bot.on('shardError', error => {
    console.error('A websocket connection encountered an error:', error);
});

bot.on('message', async message => {
    let messageText = message.content;
    if(messageText.match(commandRegex))
    {
        let newNums = messageText.match(digitsRegex);
        if(newNums.length === 2) {
            messageText = `!d.${newNums[0]}.${newNums[1]}`;
        }
    }
    if (messageText.substring(0, 1) === prefix) {

        let args = messageText.substring(1).split('.');
        let cmd = "";
        if (messageText.toLocaleLowerCase().startsWith("!8ball")) {
            cmd = "8ball";
        } else {
            cmd = args[0].toLowerCase();
        }
        if (cmd.startsWith('uptime')) {
            args[1] = startTime;
        }
        if (cmd.startsWith('vhelp')) {
            args[args.length] = commands;
        }

        if (!clientCommands[cmd]) return;

        try {
            clientCommands[cmd].execute(args, message);
        } catch (error) {
            console.error(error);
            message.channel.send("Error occurred.");
        }
}});

// Create an event listener for new guild members
bot.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.cache.find(ch => ch.name === channelName);

    if(!channel) return;

    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
    serverCommand.welcomeBot(channel);
});

bot.login(token);
