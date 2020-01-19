{
    let RPS = [
        'Rock',
        'Paper',
        'Scissors'
    ];

    let RPSScore = [];

    /***
     * @param {string}userInput user selection
     * @param {string}userId the user id
     * @returns {string} returns the message
     * */
    function RockPaperScissors(userInput, userId) {
        let user = undefined;
        for (let i = 0; i < RPSScore.length; i++) {
            if (RPSScore[i].userID === userId) {
                user = RPSScore[i];
                break;
            }
        }
        if (user === undefined) {
            user = {
                userID: userId,
                w: 0, //wins
                l: 0, //loses
                t: 0,//ties
                r: 0,//rock
                p: 0,//paper
                s: 0//scissors.js
            };
        }
        let cpuPick = RPS[Math.floor(Math.random() * RPS.length)];
        let message = '';
        //User and computer picked the same
        if (cpuPick.toLowerCase() === userInput.toLowerCase()) {
            user.t++;
            message = 'You picked ' + cpuPick.toLowerCase() + ', cpu picked ' + userInput.toLowerCase() + '. You tied. <@' + userId + '>\n' +
                ' wins ' + user.w +
                '\nloses ' + user.l +
                '\nties ' + user.t;
        } else if (userInput.toLowerCase() === 'rock') {
            if (cpuPick.toLowerCase() === 'paper') {
                user.l++;
                message = 'You picked rock, cpu picked paper. You lost. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            } else {
                user.w++;
                message = 'You picked rock, cpu picked scissors.js. You won. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            }
        } else if (userInput.toLowerCase() === 'paper') {
            if (cpuPick.toLowerCase() === 'scissors.js') {
                user.l++;
                message = 'You picked paper, cpu picked scissors.js. You lost. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            } else {
                user.w++;
                message = 'You picked paper, cpu picked rock. You won. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            }
        } else {
            if (cpuPick.toLowerCase() === 'rock') {
                user.l++;
                message = 'You picked scissors.js, cpu picked rock. You lost. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            } else {
                user.w++;
                message = 'You picked scissors.js, cpu picked paper. You won. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            }
        }
        let newUser = true;
        for (let i = 0; i < RPSScore.length; i++) {
            if (RPSScore[i].userID === user.userID) {
                RPSScore[i] = user;
                newUser = false;
                break;
            }
        }
        if (newUser) {
            RPSScore.push(user);
        }

        return message;

    }

    module.exports.RockPaperSissors = RockPaperScissors;
}
