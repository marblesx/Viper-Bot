const RockPaperScissors = require('../Common/RockPaperScissorsGame');


module.exports = {
    name: 'scissors',
    description: 'Scissors command for rock/paper/scissors.',
    execute(args, bot, channelID,userID){
        bot.sendMessage({
            to: channelID,
            message: RockPaperScissors('scissors',userID)
        });
    }
};
