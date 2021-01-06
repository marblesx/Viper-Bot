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
                    .addField('!halo.g.{gamertag}', 'Returns some stats about that gamer tag', true)
                    .addField('!halo.{name}', 'Returns some stats about that viper (eddie, matt, mark, mike)', true)
                    .addField('!halo.{name}.{x}', 'Returns some stats about that viper (eddie, matt, mark, mike) where x is the last number of games', true)
                    .addField('!halo.{name}.{x}a', 'Returns AVG stats about that viper (eddie, matt, mark, mike) where x is the last number of games', true)
                    .addField('!halo.g.{gamerTag}', 'Returns some stats about that gamertag', true)
                    .addField('!halo.g.{gamerTag}.{x}', 'Returns some stats about that gamertag, where x is the last number of games.', true)
                    .addField('!halo.g.{gamerTag}.{x}a', 'Returns AVG stats about that gamertag, where x is the last number of games.', true)
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
