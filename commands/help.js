module.exports = {
    name: 'vhelp',
    description: 'Help command, will give you all the help you need.',
    execute(args, bot, channelID, userID){
        bot.sendMessage({
            to: channelID,
            message: 'Some commands are: ' + Object.keys( args[2]).map( function(key){ return key + ":\n" + args[2][key] + "\n" }).join(", ")
        });
    }
};
