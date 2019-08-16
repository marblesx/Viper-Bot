{
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
            user.userId = userId;
            user.w = 0; //wins
            user.l = 0; //loses
            user.t = 0;//ties
            user.r =0;//rock
            user.p=0;//paper
            user.s =0;//scissors
        }
        let cpuPick = RPS[Math.floor(Math.random()*RPS.length)];
        let message = '';
        //User and computer picked the same
        if(cpuPick.toLowerCase() === userInput.toLowerCase())
        {
            user.t++;
            message = 'You picked '+cpuPick.toLowerCase()+', cpu picked '+userInput.toLowerCase()+'. You tied. <@'+ userID +'>\n' +
                ' wins ' + user.w +
                '\nloses '+ user.l +
                '\nties '+ user.t
        }
        else  if(userInput.toLowerCase() === 'rock')
        {
            if(cpuPick.toLowerCase() === 'paper'){
                user.l++;
                message = 'You picked rock, cpu picked paper. You lost. <@'+ userID +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
            else
            {
                user.w++;
                message = 'You picked rock, cpu picked scissors. You won. <@'+ userID +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
        }
        else  if(userInput.toLowerCase()=== 'paper')
        {
            if(cpuPick.toLowerCase() === 'scissors'){
                user.l++;
                message = 'You picked paper, cpu picked scissors. You lost. <@'+ userID +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
            else
            {
                user.w++;
                message = 'You picked paper, cpu picked rock. You won. <@'+ userID +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
        }
        else
        {
            if(cpuPick.toLowerCase() === 'rock'){
                user.l++;
                message = 'You picked paper, cpu picked paper. You lost. <@'+ userID +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
            else
            {
                user.w++;
                message = 'You picked paper, cpu picked scissors. You won. <@'+ userID +'>\n' +
                    ' wins ' + user.w +
                    '\nloses '+ user.l +
                    '\nties '+ user.t
            }
        }
        let newUser = true;
        for(let i = 0; i<RPSScore.length; i++)
        {
            if(RPSScore[i].userID === user.userId) {
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

    module.exports.eightBall = EightBall;
    module.exports.RockPaperScissors = RockPaperScissors;
}