const RockPaperScissors = require('/common/RockPaperScissorsGame');


module.exports = {
    name: 'scissors.js',
    description: 'Scissors command for rock/paper/scissors.js.',
    execute(args, bot, channelID,userID){
        bot.sendMessage({
            to: channelID,
            message: RockPaperScissors('scissors.js',userID)
        });
    }
};
