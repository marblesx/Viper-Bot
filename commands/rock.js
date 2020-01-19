const RockPaperScissors = require('../Common/RockPaperScissorsGame');


module.exports = {
    name: 'rock',
    description: 'Rock command for rock/paper/scissors.',
    execute(args, bot, channelID,userID){
        bot.sendMessage({
            to: channelID,
            message: RockPaperScissors.RockPaperSissors('rock',userID)
        });
    }
};
