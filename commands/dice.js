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

function rollMutlipleDice(args) {
    let total = 0;
    let diceNum = parseInt(args[1]);
    let message = `You rolled a ${args[1]} sided dice, ${args[2]} times. Your rolls are: `;
    for (let d = 0; d < parseInt(args[2]); d++) {
        let roll = Dice(diceNum)
        total += roll;
        message += `${roll}, `;
    }
    message += `for a total of ${total}.`;
    return message;
}

module.exports = {
    name: 'd',
    description: 'Dice rolling command, d.20 will roll a 20 sided dice.',
    execute(args, bot) {
        if (args.length === 3) {
            let message = rollMutlipleDice(args);

            bot.channel.send(message);
        } else {
            bot.channel.send('You rolled a ' + Dice(parseInt(args[1])))
        }
    }
}

