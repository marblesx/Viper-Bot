
const { prefix } = require('../config.json');

const data = [];
const { commands } = message.client;


module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    aliases: ['commands'],
    usage: '[command name]',
    cooldown: 5,
    execute(args, bot, channelID, userID){
        const data = [];
        const { commands } = args[1].client;

        if (!args.length) {
            data.push('Here\'s a list of all my commands:');
            data.push(commands.map(command => command.name).join(', '));
            data.push(`\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`);

            return args[1].author.send(data, { split: true })
                .then(() => {
                    if (args[1].channel.type === 'dm') return;
                    args[1].reply('I\'ve sent you a DM with all my commands!');
                })
                .catch(error => {
                    console.error(`Could not send help DM to ${args[1].author.tag}.\n`, error);
                    args[1].reply('it seems like I can\'t DM you! Do you have DMs disabled?');
                });
        }
    },
};
