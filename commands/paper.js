const RockPaperScissors = require('../Common/RockPaperScissorsGame');


module.exports = {
    name: 'paper',
    description: 'Paper command for rock/paper/scissors.',
    execute(args, bot, channelID,userID){
        bot.sendMessage({
            to: channelID,
            message: RockPaperScissors.RockPaperSissors('paper',userID)
        });
    }
};
