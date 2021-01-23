const appName = 'h1';

{
    const haloLogic = require('../Common/haloLogic');
    function haloMethod(args, bot) {
        haloLogic.haloLogic(bot, args[1].toLowerCase(), args,"Halo: CE");
    }

    module.exports = {
        name:appName,
        description: 'Gets halo ce stats, recent games, etc.',
        execute(args, bot){
            haloMethod(args,bot);
        }
    };
}
