const appName = 'h3';

{
    const haloLogic = require('../Common/haloLogic');
    function haloMethod(args, bot) {
        haloLogic.haloLogic(bot, args[1].toLowerCase(), args,"Halo 3");
    }

    module.exports = {
        name:appName,
        description: 'Gets halo 3 stats, recent games, etc.',
        execute(args, bot){
            haloMethod(args,bot);
        }
    };
}
