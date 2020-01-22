const RockPaperScissors = require('../Common/RockPaperScissorsGame');


module.exports = {
    name: 'scissors',
    description: 'Scissors command for rock/paper/scissors.',
    execute(args, bot){
        bot.channel.send(RockPaperScissors.RockPaperSissors('scissors',bot.author.id));
    }
};
