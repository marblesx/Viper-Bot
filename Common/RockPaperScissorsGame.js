{
    const rockPaperScissorsDAL = require('../dataAccessLayer/rockPaperScissorsDAL');
    let RPS = [
        'Rock',
        'Paper',
        'Scissors'
    ];

    let RPSScore = [];

    /***
     * @param {string}userInput user selection
     * @param {object}bot botobject
     * @returns {string} returns the message
     * */
    async function  RockPaperScissors(userInput, bot) {
        const userId = bot.author.id;

        let user = await rockPaperScissorsDAL.findPlayer({userGuid: userId, rock: 0, paper:0, scissors: 0, wins: 0, ties: 0, lost: 0});
        let newUser = false;
        if (user.length === 0) {
            newUser = true;
            user[0] = {
                userGuid: userId,
                wins: 0, //wins
                loses: 0, //loses
                ties: 0,//ties
                rock: 0,//rock
                paper: 0,//paper
                scissors: 0//scissors
            };
        }

        user = user[0];


        let cpuPick = RPS[Math.floor(Math.random() * RPS.length)];
        let message = '';
        //User and computer picked the same
        if (cpuPick.toLowerCase() === userInput.toLowerCase()) {
            user.ties++;
            message = 'You picked ' + cpuPick.toLowerCase() + ', cpu picked ' + userInput.toLowerCase() + '. You tied. <@' + userId + '>\n' +
                ' wins ' + user.wins +
                '\nloses ' + user.loses +
                '\nties ' + user.ties;
        } else if (userInput.toLowerCase() === 'rock') {
            if (cpuPick.toLowerCase() === 'paper') {
                user.loses++;
                message = 'You picked rock, cpu picked paper. You lost. <@' + userId + '>\n' +
                    ' wins ' + user.wins +
                    '\nloses ' + user.loses +
                    '\nties ' + user.ties;
            } else {
                user.wins++;
                message = 'You picked rock, cpu picked scissors. You won. <@' + userId + '>\n' +
                    ' wins ' + user.wins +
                    '\nloses ' + user.loses +
                    '\nties ' + user.ties;
            }
        } else if (userInput.toLowerCase() === 'paper') {
            if (cpuPick.toLowerCase() === 'scissors') {
                user.loses++;
                message = 'You picked paper, cpu picked scissors. You lost. <@' + userId + '>\n' +
                    ' wins ' + user.wins +
                    '\nloses ' + user.loses +
                    '\nties ' + user.ties;
            } else {
                user.wins++;
                message = 'You picked paper, cpu picked rock. You won. <@' + userId + '>\n' +
                    ' wins ' + user.wins +
                    '\nloses ' + user.loses +
                    '\nties ' + user.ties;
            }
        } else {
            if (cpuPick.toLowerCase() === 'rock') {
                user.loses++;
                message = 'You picked scissors, cpu picked rock. You lost. <@' + userId + '>\n' +
                    ' wins ' + user.wins +
                    '\nloses ' + user.loses +
                    '\nties ' + user.ties;
            } else {
                user.wins++;
                message = 'You picked scissors, cpu picked paper. You won. <@' + userId + '>\n' +
                    ' wins ' + user.wins +
                    '\nloses ' + user.loses +
                    '\nties ' + user.ties;
            }
        }
        let result;
        if(newUser)
        {
            result = await rockPaperScissorsDAL.insertPlayer(user);
        }
        else
        {
            result = await rockPaperScissorsDAL.updatePlayer(user);
        }

      bot.channel.send(message);

    }

    module.exports.RockPaperSissors = RockPaperScissors;
}
