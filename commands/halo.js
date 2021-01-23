const appName = 'halo';

{
    const haloLogic = require('../Common/haloLogic');
    function haloMethod(args, bot) {

        haloLogic.haloLogic(bot, args[1].toLowerCase(), args,"All");

    }

    module.exports = {
        name:appName,
        description: 'Gets halo stats, recent games, etc.',
        execute(args, bot){
            haloMethod(args,bot);
        }
    };
}
