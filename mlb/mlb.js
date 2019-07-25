
{
    const common = require('../Common/common');
    const request = require('request');
    let BASE_URL = 'https://statsapi.mlb.com/api/';
    let currentGame = "In Progress";
    let notPlayed = "Pre-Game";
    let FinalGame = "Final"
    /**
     * This handles all the arg method calls for mlb
     * @param {string[] }args
     */
    function mlbMethods(args, callback) {

        switch (args[1]){
            case 'games':
                callback(gamesToday());
                break;
                default:
                    callback("Invalid command, try !mlb.help for a list of valid commands.");
        }

    }


    function gamesToday() {
        let message = '';
        let date = common.getToDaysDate();
        let url = BASE_URL + 'v1/schedule/games/?sportId=1&date=' + date;


        request.get({
            url: url,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if (err) {
                console.log('Error:', err);
            } else if (res.statusCode !== 200) {
                console.log('Status:', res.statusCode);
            } else {
                // data is already parsed as JSON:
                if (data.dates.length !== 0) {
                    console.log('got data');
                    let games = data.dates[0].games;
                    for (let i = 0; i < games.length; i++) {

                        message += gameStatus(games[i].status.detailedState, games[i].teams.away, games[i].teams.home, games[i].gameDate);
                    }
                    console.log(message);
                    return message;
                } else {
                    return "Boo! No games today."
                }
            }
        });
    }

    /**
     *
     * @param {string} status
     * @param {object} awayTeam
     * @param {object} homeTeam
     * @param {string} gameDate
     */
    function gameStatus(status, awayTeam, homeTeam, gameDate) {
        let toReturn = '';
        switch(status){
            case currentGame:
            if(awayTeam.score > homeTeam.score)
            {
               toReturn = awayTeam.team.name + " are beating " + homeTeam.team.name + ": " + awayTeam.score + "-"+ homeTeam.score;
            }
            else
            {
                toReturn = awayTeam.team.name + " are loosing to " + homeTeam.team.name + ": " + awayTeam.score + "-"+ homeTeam.score;
            }
            break;
            case notPlayed:
                toReturn = awayTeam.team.name + " are playing " + homeTeam.team.name + " at " + common.convertTime(gameDate);
                break;
            case FinalGame:
                if(awayTeam.score > homeTeam.score)
                {
                    toReturn = awayTeam.team.name + "  beat " + homeTeam.team.name + ": " + awayTeam.score + "-"+ homeTeam.score;
                }
                else
                {
                    toReturn = awayTeam.team.name + " lost to " + homeTeam.team.name + ": " + awayTeam.score + "-"+ homeTeam.score;
                }
                break;

        }
        return toReturn + "\n";

    }







// exports the variables and functions above so that other modules can use them
module.exports.mlbMethods = mlbMethods;


}
