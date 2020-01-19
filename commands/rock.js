const RockPaperScissors = require('/common/RockPaperScissorsGame');


module.exports = {
    name: 'rock',
    description: 'Rock command for rock/paper/scissors.js.',
    execute(args, bot, channelID,userID){
        bot.sendMessage({
            to: channelID,
            message: RockPaperScissors('rock',userID)
        });
    }
};
