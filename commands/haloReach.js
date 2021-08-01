const appName = 'haloreach';

{
    const haloLogic = require('../Common/haloLogic');
    function haloMethod(args, bot) {
        haloLogic.haloLogic(bot, args[1].toLowerCase(), args,"Halo: Reach");
    }

    module.exports = {
        name:appName,
        description: 'Gets halo reach stats, recent games, etc.',
        execute(args, bot){
            haloMethod(args,bot);
        }
    };
}