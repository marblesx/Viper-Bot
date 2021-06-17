const request = require('request');
const request_sync = require('sync-request');

const viperId='397605'
const Discord = require('discord.js');

function getStatData(url, headers, bot) {
    request.get({
        url: url,
        json: true,
        headers:headers
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
        } else {
            for(const member of data.members){
                let gameEmbed = new Discord.MessageEmbed()
                    .setColor('#b6d6eb')
                    .setTitle(`Career stats for ${member.name}`)
                    .addField('Goals', member.skgoals,true)
                    .addField('Assists', member.skassists,true)
                    .addField('Points', member.skpoints, true)
                    .addField('Points per Game', member.skpointspg, true)
                    .addField('Game winning goals', member.skgwg, true)

                if(parseInt(member.glwins) >  0||  parseInt(member.gllosses) > 0 || parseInt(member.glotl) > 0){
                    gameEmbed.addField('Goalie record', `${member.glwins}-${member.gllosses}-${member.glotl}`)
                    gameEmbed.addField('Save %', member.glsavepct)
                }
                bot.channel.send(gameEmbed);
            }
        }
    });
}

function getSeasonData(url, headers, bot){
    request.get({
        url: url,
        json: true,
        headers:headers
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
            return undefined;
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
            return undefined;
        } else {
            const stats = data[0];
            let gameEmbed = new Discord.MessageEmbed()
                .setColor('#b6d6eb')
                .setTitle(`Season Stats for Vipers`)
                .addField('Record', `${stats.wins}-${stats.losses}-${stats.otl}`,true)
                .addField('Goals', stats.goals,true)
                .addField('Goals Against', stats.goalsAgainst, true)

            bot.channel.send(gameEmbed);
        }
    });

}

function chel(args, bot){
    switch (args[1]){
        case 'finals':
            break;
        case 'club':
            break;
        case 'stats':
            getStatData('https://proclubs.ea.com/api/nhl/members/stats?clubId=397605&platform=ps4', {'Referer': 'www.ea.com'}, bot)
            break;
        case 'season':
            getSeasonData('https://proclubs.ea.com/api/nhl/clubs/seasonRank?platform=ps4&clubIds=397605', {'Referer': 'www.ea.com'}, bot)
            break;

    }
}


module.exports = {
    name: 'chel',
    description: 'Gets CHEL Commands for the Viper hockey team.',
    execute(args, bot) {
        chel(args, bot);
    }
}

