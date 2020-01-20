module.exports = {
    name: 'vhelp',
    description: 'Help command, will give you all the help you need.',
    execute(args, bot, channelID, userID){
        let commands = args[2];
        bot.sendMessage({
            to: channelID,
            message: 'Some commands are: ' +
                Object.keys(commands).map( function(key){ return key + ":\n" + commands[key].description + "\n" }).join('')
        });
    }
};
