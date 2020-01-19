


module.exports = {
    name: 'help',
    description: 'List all of my commands or info about a specific command.',
    execute(args, bot, channelID, userID) {
        const data = [];
        const commands = [];

        if (!args.length) {
            data.push('Here\'s a list of all my commands:\n');
            data.push(args[1].map(command => command).join(', '));
            data.push(`\nYou can send \`$![command name].help\` to get info on a specific command!`);

            bot.sendMessage({
                to: channelID,
                message: data
            });
        }
    }
};
