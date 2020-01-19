
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
module.exports = {
    name: 'flip',
    description: 'Flips a coin, either way you lose.',
    execute(args, bot, channelID, userID){
        bot.sendMessage({
            to: channelID,
            message: CoinFlip()
        });
    }
};
