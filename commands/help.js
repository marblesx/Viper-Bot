const Discord = require('discord.js');

/*
@param commands {array} array of command objects found using the command pattern
@returns an object to send to the channel.
 */
function getDynamicCommands(commands){
    const help = new Discord.MessageAttachment('./content/help-icon.png');
    const logo = new Discord.MessageAttachment('./content/viper-icon.png');
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('#2dff16')
        .setTitle('Viper Bot Help Commands')
        .setURL('https://github.com/marblesx')
        .setAuthor('Dev Team', 'attachment://help-icon.png', 'https://github.com/marblesx')
        .setDescription('List of help and commands for the Viper Bot.')
        .setThumbnail('attachment://viper-icon.png');

    let returnList = "";
    commands.forEach(command => {
        helpEmbed.addField(command.name, command.description, true);
        }
    );
    return { files: [help, logo], embed: helpEmbed };
}

module.exports = {
    name: 'vhelp',
    description: 'Help command, will give you all the help you need.',
    execute(args, bot){
        bot.channel.send(
              getDynamicCommands(args[args.length-1]));
    }
};
