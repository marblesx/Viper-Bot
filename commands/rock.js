const RockPaperScissors = require('../Common/RockPaperScissorsGame');


module.exports = {
    name: 'rock',
    description: 'Rock command for rock/paper/scissors.',
    execute(args, bot){
       RockPaperScissors.RockPaperSissors('rock',bot);
    }
};
