
{
    const unUsableNickNames = ['register','deregister','stats', 'rank']
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



    async function splitGateMethod(args,bot) {
       switch(args[1]){
           case "help":
               const helpEmbed = new Discord.MessageEmbed()
                   .setColor('#2dff16')
                   .setTitle('SplitGate Help Commands')
                   .setURL('https://github.com/marblesx')
                   .setAuthor('Dev Team', '', 'https://github.com/marblesx')
                   .setDescription('List of help and commands for the SplitGate commands.')
               bot.channel.send(`Sliding in to your DM's <@${bot.author.id}>` );

               await bot.author.send(helpEmbed);
               break;
           case "register":
               await registerUser(args,bot);
               break;
           case "deregister":
               await deregisterUser(bot);
               break;
           case "stats":
               const user = await splitgateDAL.findRegisteredUser(bot.author.id);
               if(user.length !== 0){
                   await getStats(user[0],bot);
               } else{
                   bot.channel.send(`User <@${bot.author.id}> is not registered.`);
               }
               break;
           default:
               let nickName = args[1];
               const userNickName = await splitgateDAL.getUserByNickname(nickName);
              if(userNickName.length !== 0){
                  await getStats(userNickName[0],bot);
               }
               else {
                  bot.channel.send(`User <@${bot.author.id}> is not registered.`);
              }
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
