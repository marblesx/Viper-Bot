const appName = 'h4';

{
    const haloLogic = require('../Common/haloLogic');
    function haloMethod(args, bot) {
        haloLogic.haloLogic(bot, args[1].toLowerCase(), args,"Halo 4");
    }

    module.exports = {
        name:appName,
        description: 'Gets halo 4 stats, recent games, etc.',
        execute(args, bot){
            haloMethod(args,bot);
        }
    };
}
