
{
    const common = require('../common/common.js');
    const https = require('https');
    const logger = require('winston');
    let BASE_URL = 'https://statsapi.mlb.com/api/';

    /**
     * This handles all the arg method calls for mlb
     * @param {string[] }args
     */
    function mlbMethods(args) {

        switch (args[1]){
            case 'games':
                return gamesToday();
                break;
                default:
                    return "Invalid command, try !mlb.help for a list of valid commands.";
        }

    }


    function gamesToday() {
        let message = '';
        let data;
        let date = common.getToDaysDate();
        https.get(BASE_URL+'v1/schedule/games/?sportId=1&date='+date, (resp) => {
            resp.on('data', (chuck)=> {
                data += chuck;
            });
            resp.on('end', () => {
               if(data.dates.length !== 0)
               {
                   let games = data.dates.games;
                   for(let i = 0; i < games.length; i++){
                       let winnerStatus = '';
                       if(games[i].teams[0].team.isWinner)
                       {
                           winnerStatus = " beat "
                       }
                       else
                       {
                           winnerStatus = " lost to "
                       }
                      message += games[i].teams[0].team.name + winnerStatus + games[i].teams[1].team.name + " " +
                          games[i].teams[0].score + "-" + games[i].teams[1].score + "\n"
                   }
                   return message;
               }
               else
               {
                   return "Boo! No games today."
               }
            });
        }).on("error", (err) => {
            logger.error("Error: " + err.message);
            return "Oh shit, something went wrong.... ";
        });
    }





// exports the variables and functions above so that other modules can use them
module.exports.mlbMethods = mlbMethods(args);


}