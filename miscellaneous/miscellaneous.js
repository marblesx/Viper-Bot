{
    const spawn  = require('child_process').spawn;

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


    /***
     * Gets message from 8Ball
     * returns Returns random string.
     * */
    function EightBall() {
        return eightballPhrases[Math.floor(Math.random()*eightballPhrases.length)];
    }
    /***
     * @param {string}userInput user selection
     * @param {string}userId the user id
     * @return returns the message
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
            user= {
                userID :userId,
            w : 0, //wins
            l : 0, //loses
            t : 0,//ties
            r : 0,//rock
            p : 0,//paper
            s : 0//scissors
        }
        }
        let cpuPick = RPS[Math.floor(Math.random()*RPS.length)];
        let message = '';
        //User and computer picked the same
        if(cpuPick.toLowerCase() === userInput.toLowerCase())
        {
            user.t++;
            message = 'You picked '+cpuPick.toLowerCase()+', cpu picked '+userInput.toLowerCase()+'. You tied. <@'+ userId +'>\n' +
                ' wins ' + user.w +
                '\nloses '+ user.l +
                '\nties '+ user.t
        }
        else  if(userInput.toLowerCase() === 'rock')
        {
            if(cpuPick.toLowerCase() === 'paper'){
                user.l++;
                message = 'You picked rock, cpu picked paper. You lost. <@'+ userId +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
            else
            {
                user.w++;
                message = 'You picked rock, cpu picked scissors. You won. <@'+ userId +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
        }
        else  if(userInput.toLowerCase()=== 'paper')
        {
            if(cpuPick.toLowerCase() === 'scissors'){
                user.l++;
                message = 'You picked paper, cpu picked scissors. You lost. <@'+ userId +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
            else
            {
                user.w++;
                message = 'You picked paper, cpu picked rock. You won. <@'+ userId +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
        }
        else
        {
            if(cpuPick.toLowerCase() === 'rock'){
                user.l++;
                message = 'You picked scissors, cpu picked rock. You lost. <@'+ userId +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
            else
            {
                user.w++;
                message = 'You picked scissors, cpu picked paper. You won. <@'+ userId +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
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
            return "Heads"
        else
            return "Tails"
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

    function reboot() {
        const child = spawn('. ~/Viper-Bot/rebootCommands.sh');
        child.on('exit', code => {
            console.log(`Exit code is: ${code}`);
        });
    }

    module.exports.reboot = reboot;
    module.exports.dice = Dice;
    module.exports.eightBall = EightBall;
    module.exports.RockPaperScissors = RockPaperScissors;
    module.exports.CoinFlip = CoinFlip;
}
