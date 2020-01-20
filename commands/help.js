function getDynamicCommands(commands){
    let returnList = "";
    commands.forEach(command =>
    returnList+= command.name + ": "+ command.description +"\n";
    );
    return returnList;
}

module.exports = {
    name: 'vhelp',
    description: 'Help command, will give you all the help you need.',
    execute(args, bot, channelID, userID){

        bot.sendMessage({
            to: channelID,
            message: 'Some commands are: \n' +
              getDynamicCommands(args[2])
        });
    }
};
