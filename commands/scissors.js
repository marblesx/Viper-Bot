const RockPaperScissors = require('../Common/RockPaperScissorsGame');


module.exports = {
    name: 'scissors',
    description: 'Scissors command for rock/paper/scissors.',
    execute(args, bot){
       RockPaperScissors.RockPaperSissors('scissors',bot);
    }
};
