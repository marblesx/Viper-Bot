const RockPaperScissors = require('../Common/RockPaperScissorsGame');


module.exports = {
    name: 'paper',
    description: 'Paper command for rock/paper/scissors.',
    execute(args, bot){
      RockPaperScissors.RockPaperSissors('paper',bot);
    }
};
