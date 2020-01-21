function getDynamicCommands(commands){
    let returnList = "";
    console.log(commands);
    commands.forEach(command =>
    returnList+= command.name + ": "+ command.description +"\n"
    );
    return returnList;
}

module.exports = {
    name: 'vhelp',
    description: 'Help command, will give you all the help you need.',
    execute(args, bot, channelID, userID){
        console.log(args);
        bot.sendMessage({
            to: channelID,
            message: 'Some commands are: \n' +
              getDynamicCommands(args[args.length-1])
        });
    }
};
