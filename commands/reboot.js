
const exec = require('child_process').exec;
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
module.exports = {
    name: 'reboot',
    description: 'Reboots the bot and pulls latest code.',
    execute(args, bot, channelID, userID){
        bot.sendMessage({
            to: channelID,
            message: 'Updating with latest code!'
        });
        reboot();
    }
};
