const appName = 'halo';

{
    const lib = require('lib');
    const Discord = require('discord.js');
    const haloLogic = require('../Common/haloLogic');
    const haloDAL = require('../dataAccessLayer/haloDAL');
    let _bot;
    let _userGuid;
    function haloMethod(args, bot) {
        _bot = bot;
        _userGuid = bot.author.id;

        switch (args[1].toLowerCase()){
            case 'help':
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor('#2dff16')
                    .setTitle('Halo Help Commands')
                    .setURL('https://github.com/marblesx')
                    .setAuthor('Dev Team', '', 'https://github.com/marblesx')
                    .setDescription('List of help and commands for the HALO commands.')
                    .addField('!halo.register.{gamertag}.{nickname}', 'Registers gamertag to user account with nickname. ', true)
                    .addField('!halo.deregister', 'Deregisteres gamertag from user.', true)
                    .addField('!halo.me', 'Gets user stats.', true)
                    .addField('!halo.{nickname}', 'Gets user stats.', true)
                    .addField('!halo.gamertag', 'gets stats of gamertag', true)
                    .addField('!halo.{me/Nickname/Gamertag}.{digit}', 'Gets last x games up to 10', true)
                    .addField('!halo.{me/Nickname/Gamertag}.{digit}a', 'Gets average of last games up to 250', true)
                _bot.channel.send(`Sliding in to your DM's <@${bot.author.id}>` );

                _bot.author.send(helpEmbed);
                break;
           default:
               haloLogic.haloLogic(bot, args[1].toLowerCase(), args);
        }
    }

    module.exports = {
        name:appName,
        description: 'Gets halo stats, recent games, etc.',
        execute(args, bot){
            haloMethod(args,bot);
        }
    };
}
