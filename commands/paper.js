const RockPaperScissors = require('../Common/RockPaperScissorsGame');


module.exports = {
    name: 'paper',
    description: 'Paper command for rock/paper/scissors.',
    execute(args, bot){
       bot.channel.send(RockPaperScissors.RockPaperSissors('paper',bot.author.id));
    }
};
