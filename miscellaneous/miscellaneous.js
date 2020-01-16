{
    const fs = require('fs');
    const exec = require('child_process').exec;



    let eightballPhrases = [
        'As I see it, yes.',
        'Ask again later.',
        'Better not tell you now.',
        'Cannot predict now.',
        'Concentrate and ask again.',
        'Don’t count on it.',
        'It is certain.',
        'It is decidedly so.',
        'Most likely.',
        'My reply is no.',
        'My sources say no.',
        'Outlook not so good.',
        'Outlook good.',
        'Reply hazy, try again.',
        'Signs point to yes.',
        'Very doubtful.',
        'Without a doubt.',
        'Yes.',
        'Yes – definitely.',
        'You may rely on it.'
    ];

    let RPS =[
        'Rock',
        'Paper',
        'Scissors'
    ];

    let RPSScore = [];

    /**
     * Gets the latest changes as listed in the file.
     * @returns {string} Returns the file contents, or the error.
     * */
    function getLatestChanges() {
        let fileContents = "";
        fs.readFile('update.txt', 'utf8', function (err, data) {
            if (err) {
                fileContents = 'Error reading from file.';
            }
            else {
                fileContents = data;
            }
           
        });
        return fileContents;
    }

    /***
     * Gets message from 8Ball
     * @returns {string} Returns random string.
     * */
    function EightBall() {
        return eightballPhrases[Math.floor(Math.random()*eightballPhrases.length)];
    }
    /***
     * @param {string}userInput user selection
     * @param {string}userId the user id
     * @returns {string} returns the message
     * */
    function RockPaperScissors(userInput, userId)
    {
        let user = undefined;
        for(let i = 0; i<RPSScore.length; i++)
        {
            if(RPSScore[i].userID === userId) {
                user = RPSScore[i];
                break;
            }
        }
        if(user === undefined)
        {
            user = {
                userID: userId,
                w: 0, //wins
                l: 0, //loses
                t: 0,//ties
                r: 0,//rock
                p: 0,//paper
                s: 0//scissors
            };
        }
        let cpuPick = RPS[Math.floor(Math.random()*RPS.length)];
        let message = '';
        //User and computer picked the same
        if(cpuPick.toLowerCase() === userInput.toLowerCase())
        {
            user.t++;
            message = 'You picked ' + cpuPick.toLowerCase() + ', cpu picked ' + userInput.toLowerCase() + '. You tied. <@' + userId + '>\n' +
                ' wins ' + user.w +
                '\nloses ' + user.l +
                '\nties ' + user.t;
        }
        else  if(userInput.toLowerCase() === 'rock')
        {
            if(cpuPick.toLowerCase() === 'paper'){
                user.l++;
                message = 'You picked rock, cpu picked paper. You lost. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            }
            else
            {
                user.w++;
                message = 'You picked rock, cpu picked scissors. You won. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            }
        }
        else  if(userInput.toLowerCase()=== 'paper')
        {
            if(cpuPick.toLowerCase() === 'scissors'){
                user.l++;
                message = 'You picked paper, cpu picked scissors. You lost. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            }
            else
            {
                user.w++;
                message = 'You picked paper, cpu picked rock. You won. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            }
        }
        else
        {
            if(cpuPick.toLowerCase() === 'rock'){
                user.l++;
                message = 'You picked scissors, cpu picked rock. You lost. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            }
            else
            {
                user.w++;
                message = 'You picked scissors, cpu picked paper. You won. <@' + userId + '>\n' +
                    ' wins ' + user.w +
                    '\nloses ' + user.l +
                    '\nties ' + user.t;
            }
        }
        let newUser = true;
        for(let i = 0; i<RPSScore.length; i++)
        {
            if(RPSScore[i].userID === user.userID) {
                 RPSScore[i] = user;
                 newUser = false;
                break;
            }
        }
        if(newUser){
            RPSScore.push(user);
        }

        return message;

    }

    /**
     * Flips a coin
     * @return {string} heads or tails
     * @constructor
     */
    function CoinFlip(){
        let FlipResult = Math.random(); // Coin in the air

        if (FlipResult >= .5)                         // Prints result 
            return "Heads";
        else
            return "Tails";
    }

    /**
     * Returns number for dice 1-6
     * @param {number}dice number
     * @return {number} dice number 1-6
     * @constructor
     */
    function Dice(dice)
    {
        return Math.floor(Math.random() * dice) + 1;
    }

    /**
     * Runs a command that pulls changes of code from git repo.
     * */
    function reboot()
    {
        const child = exec("cd ~ ; cd Viper-Bot ; git pull origin develop ", function (error, stdout, stderr) {
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        });
    }

    /**
     * comes time to current time.
     * @param {Date} startTime time object
     * @returns {string} 00:00:00 time format
     */
    function getUptime(startTime) {
        let d = (new Date().getTime() - startTime.getTime()) / 1000;

        var h = Math.floor(d / 3600);
        var m = Math.floor(d % 3600 / 60);
        var s = Math.floor(d % 3600 % 60);

        return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
    }

    module.exports.upTime = getUptime;
    module.exports.reboot = reboot;
    module.exports.dice = Dice;
    module.exports.eightBall = EightBall;
    module.exports.RockPaperScissors = RockPaperScissors;
    module.exports.CoinFlip = CoinFlip;
    module.exports.getUpdatedChanges = getLatestChanges;
}
