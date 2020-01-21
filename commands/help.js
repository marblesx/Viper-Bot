/*
@param commands {array} array of command objects found using the command pattern
@returns the string of commands and the description of each command.
 */
function getDynamicCommands(commands){
    let returnList = "";
    commands.forEach(command => {
         returnList += command.name + ": " + command.description + "\n\n";
        }
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
              getDynamicCommands(args[args.length-1])
        });
    }
};
