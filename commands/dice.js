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

module.exports = {
    name: 'd',
    description: 'Dice rolling command, d.20 will roll a 20 sided dice.',
    execute(args, bot, channelID, userID){
        bot.sendMessage({
            to: channelID,
            message: 'You rolled a ' + Dice(parseInt(args[1]))
        });
    }
};
