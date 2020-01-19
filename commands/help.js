
const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(args, bot, channelID, userID) {
        const data = [];
        const commands = [];

        if (!args.length) {
            data.push('Here\'s a list of all my commands:\n');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            bot.sendMessage({
                to: channelID,
                message: data
            });
        }
    },
};
