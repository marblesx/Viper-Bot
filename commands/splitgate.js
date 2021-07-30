const stats = 'stats';
const rank = 'rank';
const skill = 'skill';
{
    const unUsableNickNames = ['register','deregister',stats, rank]
    const Discord = require("discord.js");
    const splitgateDAL = require('../dataAccessLayer/splitgateDAL');
    const splitgateStats = 'https://public-api.tracker.gg/v2/splitgate/standard/profile/'
    const request = require('request');
    const {splitGateToken} = require('../auth');

    async function registerUser(args,bot) {
        if (!unUsableNickNames.includes(args[4].toLowerCase())) {
            if (await splitgateDAL.isNickNameAvailable(args[4].toLowerCase())) {
                if (await splitgateDAL.isUserRegistered(bot.author.id)) {
                    bot.channel.send("User is already registered, updating with new gamertag and nickname.");
                    let gamerTag = await splitgateDAL.findRegisteredUser(bot.author.id)
                    gamerTag = gamerTag[0];
                    gamerTag.userSys = args[2];
                    gamerTag.userGamerTag = args[3];
                    gamerTag.userNickName = args[4].toLowerCase();
                    await splitgateDAL.updateRegisteredUser(gamerTag);
                    bot.channel.send(`User <@${gamerTag.userGuid}> is updated to GT: ${gamerTag.userGamerTag} and nickname ${gamerTag.userNickName}`);
                } else {
                    bot.channel.send("User is not registered, registering with new gamertag and nickname.");
                    let newUser = await splitgateDAL.getSplitGateObj();
                    newUser.userGuid = bot.author.id;
                    newUser.userSys = args[2];
                    newUser.userGamerTag = args[3];
                    newUser.userNickName = args[4].toLowerCase();
                    await splitgateDAL.registerUser(newUser);
                    bot.channel.send(`User <@${newUser.userGuid}> is registered to GT: ${newUser.userGamerTag} and nickname ${newUser.userNickName}`);
                    bot.channel.send(`<@${newUser.userGuid}> use command sg.stats to get your stats`);

                }
            } else {
                bot.channel.send(`User <@${bot.author.id}> nickname ${args[3].toLowerCase()} is already in use.`);
            }
        } else {
            bot.channel.send(`User <@${bot.author.id}> nickname ${args[3].toLowerCase()} cannot be used.`);
        }
    }

    async function deregisterUser(bot){
        if(await splitgateDAL.isUserRegistered(bot.author.id)) {
            const user = await splitgateDAL.findRegisteredUser(bot.author.id)
            await splitgateDAL.deregisterUser(user[0]);
            bot.channel.send(`User <@${bot.author.id}> is no longer registered.`);
        }
        else{
            bot.channel.send(`User <@${bot.author.id}> is not registered.`);

        }
    }

    async function getStatsObject(playerObj, bot){
        return request.get({
            url: `${splitgateStats}${playerObj.userSys}/${playerObj.userGamerTag}`,
            json: true,
            headers: {'TRN-Api-Key': splitGateToken}
        }, (err, res, data) => {
            if (err || res.statusCode !== 200) {

                bot.channel.send("issue getting data from API for spligate stat");
                return {};
            } else {
               return data.data;
            }
        })
    }

    async function getStats(playerObj,bot) {
        request.get({
            url: `${splitgateStats}${playerObj.userSys}/${playerObj.userGamerTag}`,
            json: true,
            headers: {'TRN-Api-Key': splitGateToken}
        }, (err, res, data) => {
            if (err || res.statusCode !== 200) {
                bot.channel.send("issue getting data from API for spligate stat");
            } else {
                const stats = data.data.segments[0].stats;
                const statEmbed = new Discord.MessageEmbed()
                    .setColor('#163dff')
                    .setTitle(`Overall Stats for ${playerObj.userGamerTag}`)
                    .addField('Kills',stats.kills.displayValue, true)
                    .addField('Assist',stats.assists.displayValue, true)
                    .addField('Deaths',stats.deaths.displayValue, true)
                    .addField('K/D',stats.kd.displayValue, true)
                    .addField('KA/D',stats.kad.displayValue, true)
                    .addField('Teabags',stats.teabags.displayValue, true)
                    .addField('Damage Dealt',stats.damageDealt.displayValue, true)
                    .addField('Wins',stats.wins.displayValue, true)
                    .addField('Losses',stats.losses.displayValue, true)
                    .addField('Win loss %',stats.wlPercentage.displayValue, true)
                    bot.channel.send(statEmbed);
            }
        })
    }



    async function getSkill(playerObj, bot){
    request.get({
        url: `${splitgateStats}${playerObj.userSys}/${playerObj.userGamerTag}`,
        json: true,
        headers: {'TRN-Api-Key': splitGateToken}
    }, (err, res, data) => {
        if (err || res.statusCode !== 200) {
            bot.channel.send("issue getting data from API for spligate stat");
        } else {
            const stats = data.data.segments[0].stats;
            const statEmbed = new Discord.MessageEmbed()
                .setColor('#163dff')
                .setTitle(`Overall Stats for ${playerObj.userGamerTag}`);
            if(stats.portalKills.displayValue !== "0"){
                statEmbed.addField(stats.portalKills.displayName,stats.portalKills.displayValue, true);
            }
            if(stats.killsThruPortal.displayValue !== "0"){
                statEmbed.addField(stats.killsThruPortal.displayName,stats.killsThruPortal.displayValue, true);
            }
            if(stats.headshotsLanded.displayValue !== "0"){
                statEmbed.addField(stats.headshotsLanded.displayName,stats.headshotsLanded.displayValue, true);
            }
            if(stats.headshotAccuracy.displayValue !== "0"){
                statEmbed.addField(stats.headshotAccuracy.displayName,stats.headshotAccuracy.displayValue, true);
            }
            if(stats.shotsAccuracy.displayValue !== "0"){
                statEmbed.addField(stats.shotsAccuracy.displayName,stats.shotsAccuracy.displayValue, true);
            }
            if(stats.medalDoubleKills.displayValue !== "0"){
                statEmbed.addField(stats.medalDoubleKills.displayName,stats.medalDoubleKills.displayValue, true);
            }
            if(stats.medalTripleKills.displayValue !== "0"){
                statEmbed.addField(stats.medalTripleKills.displayName,stats.medalTripleKills.displayValue, true);
            }
            if(stats.medalQuadKills.displayValue !== "0"){
                statEmbed.addField(stats.medalQuadKills.displayName,stats.medalQuadKills.displayValue, true);
            }
            if(stats.medalQuintKills.displayValue !== "0"){
                statEmbed.addField(stats.medalQuintKills.displayName,stats.medalQuintKills.displayValue, true);
            }
            if(stats.medalSexKills.displayValue !== "0"){
                statEmbed.addField(stats.medalSexKills.displayName,stats.medalSexKills.displayValue, true);
            }
            if(stats.medalKillstreak1.displayValue !== "0"){
                statEmbed.addField(stats.medalKillstreak1.displayName,stats.medalKillstreak1.displayValue, true);
            }
            if(stats.medalKillstreak2.displayValue !== "0"){
                statEmbed.addField(stats.medalKillstreak2.displayName,stats.medalKillstreak2.displayValue, true);
            }
            if(stats.medalKillstreak3.displayValue !== "0"){
                statEmbed.addField(stats.medalKillstreak3.displayName,stats.medalKillstreak3.displayValue, true);
            }
            if(stats.medalKillstreak4.displayValue !== "0"){
                statEmbed.addField(stats.medalKillstreak4.displayName,stats.medalKillstreak4.displayValue, true);
            }
            if(stats.medalKillstreak5.displayValue !== "0"){
                statEmbed.addField(stats.medalKillstreak5.displayName,stats.medalKillstreak5.displayValue, true);
            }
            if(stats.medalKillstreak6.displayValue !== "0"){
                statEmbed.addField(stats.medalKillstreak6.displayName,stats.medalKillstreak6.displayValue, true);
            }
            bot.channel.send(statEmbed);
        }
    })
}



    async function splitGateMethod(args,bot) {
        const user = await splitgateDAL.findRegisteredUser(bot.author.id);
        switch (args[1]) {
            case "help":
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor('#2dff16')
                    .setTitle('SplitGate Help Commands')
                    .setURL('https://github.com/marblesx')
                    .setAuthor('Dev Team', '', 'https://github.com/marblesx')
                    .setDescription('List of help and commands for the SplitGate commands.')
                bot.channel.send(`Sliding in to your DM's <@${bot.author.id}>`);

                await bot.author.send(helpEmbed);
                break;
            case "register":
                await registerUser(args, bot);
                break;
            case "deregister":
                await deregisterUser(bot);
                break;
            case stats:
                if (user.length !== 0) {
                    await getStats(user[0], bot);
                } else {
                    bot.channel.send(`User <@${bot.author.id}> is not registered.`);
                }
                break;
            case skill:
                if (user.length !== 0) {
                    await getSkill(user[0], bot);
                } else {
                    bot.channel.send(`User <@${bot.author.id}> is not registered.`);
                }
                break;
            default:
                let nickName = args[1];
                const userNickName = await splitgateDAL.getUserByNickname(nickName);
                if (userNickName.length !== 0) {

                   await splitGateMethodsNickName(args, bot, userNickName[0]);
                } else {
                    bot.channel.send(`User <@${bot.author.id}> is not registered, or command not recognized.`);
                }
        }
    }

    async function getAllRegisteredUsers(registeredUsers,bot, userStats) {
        for (let user of registeredUsers) {
            getStatsObject(user, bot).then(obj => {
                userStats.push(obj);
            })
        }
        return userStats;
    }

    async function rankCommands( command, bot){
        let registeredUsers = await splitgateDAL.getAllUsers();
        let userStats = [];
        const statCard = new Discord.MessageEmbed()
            .setColor('#2dff16')
            .setTitle('Ranks')



        getAllRegisteredUsers(registeredUsers, bot, userStats).then();
        switch(command){
            case 'kills':
                userStats.sort((a,b)=>(a.segments.stats.kills.value > b.segments.stats.kills.value )? 1: -1);
                for(const card of userStats){
                    statCard.addField(card.platformInfo.platformUserIdentifier, card.segments.stats.kills.displayValue);
                }
                break;
        }
        bot.channel.send(statCard);
    }

    async function splitGateMethodsNickName(args, bot,userNickName){
      switch(args[2].toLowerCase()){
          case stats:
              await getStats(userNickName,bot);
              break;
          case rank:
              if(user.length !== 0){
                  await rankCommands(args[3],bot);
              } else{
                  bot.channel.send(`User <@${bot.author.id}> is not registered.`);
              }
              break;
          case skill:
              if(user.length !== 0){
                  await getSkill(userNickName,bot);
              } else{
                  bot.channel.send(`User <@${bot.author.id}> is not registered.`);
              }
              break;
      }
    }

    module.exports = {
        name:'sg',
        description: 'Gets splitgate stats',
        execute(args, bot){
             splitGateMethod(args,bot);
        }
    };
}
