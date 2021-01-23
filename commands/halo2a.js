const appName = 'h2a';

{
    const haloLogic = require('../Common/haloLogic');
    function haloMethod(args, bot) {
        haloLogic.haloLogic(bot, args[1].toLowerCase(), args,"Halo 2: Anniversary");
    }

    module.exports = {
        name:appName,
        description: 'Gets halo 2 anniversary stats, recent games, etc.',
        execute(args, bot){
            haloMethod(args,bot);
        }
    };
}
