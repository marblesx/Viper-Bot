/**
 * comes time to current time.
 * @param {Date} startTime time object
 * @returns {string} 00:00:00 time format
 */
function getUptime(startTime) {
    let d = (new Date().getTime() - startTime.getTime()) / 1000;

    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

module.exports = {
    name: 'upTime',
    description: 'Gets the current up time.',
    execute(args, bot){
        bot.channel.send( "Bot has been running for: " + getUptime(args[1]));
    }
};
