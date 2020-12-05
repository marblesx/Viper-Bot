const appName = 'halo';
const mark = 'mark';
const mike = 'mike';
const matt = 'matt';
const eddie = 'eddie';
const kevin = 'kevin';


const gamerTag = 'g';
const eddieGamerTag = 'fastEddeh';
const markGamerTag = 'cmilk215';
const mikeGamerTag = 'MikeKnightMedia';
const mattGamerTag = 'marbles04';
const kevinGamerTag = 'the nivekEffect';
{
    const lib = require('lib');
    const mcc = lib.halo.mcc['@0.0.11'];
    const Discord = require('discord.js');
    const common = require('../Common/common');
    let _bot;
    function haloMethod(args, bot) {
        _bot = bot;

        switch (args[1].toLowerCase()){
            case 'help':
                const helpEmbed = new Discord.RichEmbed()
                    .setColor('#2dff16')
                    .setTitle('Halo Help Commands')
                    .setURL('https://github.com/marblesx')
                    .setAuthor('Dev Team', '', 'https://github.com/marblesx')
                    .setDescription('List of help and commands for the HALO commands.')
                    .addField('!halo.g.{gamertag}', 'Returns some stats about that gamer tag', true)
                    .addField('!halo.{name}', 'Returns some stats about that viper (eddie, matt, mark, mike)', true)

                //.addField('!halo.{gamertag}')
                _bot.channel.send(helpEmbed);
                break;
            case matt:
                if(common.isNotBlank(args[2])){
                }else{
                   callBasicStats(mattGamerTag);
                }
                break;
            case mike:
                if(common.isNotBlank(args[2])){
                }else{
                    callBasicStats(mikeGamerTag);
                }
                break;
            case eddie:
                if(common.isNotBlank(args[2])){
                }else{
                    callBasicStats(eddieGamerTag);
                }
                break;
            case kevin:
                if(common.isNotBlank(args[2])){
                }else{
                    callBasicStats(kevinGamerTag);
                }
                break;
            case mark:
                if(common.isNotBlank(args[2])){
                }else{
                    callBasicStats(markGamerTag);
                }
                break;
            case gamerTag:
                if(common.isNotBlank(args[3])){
                }else{
                    callBasicStats(args[2]);
                }
                break;
            default:
                // make API request

        }
    }

    function callBasicStats(userGamerTag) {

        lib.halo.mcc['@0.0.11'].stats({
            gamertag: userGamerTag
        }).then((result) => {
            playerCard(result)
        }).catch(error =>
            _bot.channel.send(error.message)
        );

    }

    function playerCard(player) {
        const helpEmbed = new Discord.RichEmbed()
            .setColor('#b6d6eb')
            .setTitle(`Service Record: ${player.gamertag}`)
            .setDescription(`${player.gamertag} is part of ${player.clantag} and has played for ${player.playtime}`)
            .setThumbnail(player.emblem)
            .addField( "Wins", player.wins, true)
            .addField("Losses",  player.losses,true)
            .addField("Win Rate", "%"+(player.winRatio.toFixed(2) * 100).toFixed(0),true)
            .addField("Kills",  player.kills,true)
            .addField("Deaths",  player.deaths,true)
            .addField("KD",  player.killDeathRatio.toFixed(2),true)
            .addField("Kills per game",  player.killsPerGame.toFixed(2),true)
            .addField("Deaths per game",  player.deathsPerGame.toFixed(2),true)
        _bot.channel.send(helpEmbed);
    }


    module.exports = {
        name:appName,
        description: 'Gets halo stats, recent games, etc.',
        execute(args, bot){
            haloMethod(args,bot);
        }
    };
}
