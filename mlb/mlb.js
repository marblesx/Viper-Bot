{
    const common = require('../Common/common');
    const request = require('request');
    let BASE_URL = 'https://statsapi.mlb.com/api/';
    let currentGame = "In Progress";
    let PreGame = "Pre-Game";
    let FinalGame = "Final";
    let Scheduled = "Scheduled";
    let GameOver = "Game Over";
    let _bot;
    let _channelID

    /**
     * This handles all the arg method calls for mlb
     * @param {string[] } args
     * @param {object} bot
     * @param {int}channelId
     */
    function mlbMethods(args, bot, channelId) {
        _bot = bot;
        _channelID = channelId;
        switch (args[1]) {
            case 'games':
                gamesToday();
                break;
            default:
                _bot.sendMessage({
                    to: _channelID,
                    message: "Invalid command, try !mlb.help for a list of valid commands."
                });
        }
    }

    /***
     * Retrieves the current games for the current date, if they've been played, are being played, or are yet to play.
     * */
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
                    let games = data.dates[0].games;
                    for (let i = 0; i < games.length; i++) {
                        message += gameStatus(games[i].status.detailedState, games[i].teams.away, games[i].teams.home, games[i].gameDate);
                    }
                    _bot.sendMessage({
                        to: _channelID,
                        message: message
                    });
                } else {
                    _bot.sendMessage({
                        to: _channelID,
                        message: "No games today!, Boooooo"
                    });
                }
            }
        });
    }

    /**
     * @param {string} status : the Status of the current game.
     * @param {object} awayTeam : the team object for the away team.
     * @param {object} homeTeam : the team object for the home team.
     * @param {string} gameDate : The current Date of the game.
     */
    function gameStatus(status, awayTeam, homeTeam, gameDate) {
        let toReturn = '';
        switch (status) {
            case currentGame:
                if (awayTeam.score === homeTeam.score) {
                    toReturn = awayTeam.team.name + " and " + homeTeam.team.name + " are tied: " + awayTeam.score + "-" + homeTeam.score;
                } else if (awayTeam.score > homeTeam.score) {
                    toReturn = awayTeam.team.name + " are beating " + homeTeam.team.name + ": " + awayTeam.score + "-" + homeTeam.score;
                } else {
                    toReturn = awayTeam.team.name + " are loosing to " + homeTeam.team.name + ": " + awayTeam.score + "-" + homeTeam.score;
                }
                break;
            case Scheduled:
            case PreGame:
                toReturn = awayTeam.team.name + " are playing " + homeTeam.team.name + " at " + common.convertTime(gameDate);
                break;
            case FinalGame:
            case GameOver:
                if (awayTeam.score > homeTeam.score) {
                    toReturn = awayTeam.team.name + "  beat " + homeTeam.team.name + ": " + awayTeam.score + "-" + homeTeam.score;
                } else {
                    toReturn = awayTeam.team.name + " lost to " + homeTeam.team.name + ": " + awayTeam.score + "-" + homeTeam.score;
                }
                break;
        }
        return toReturn + "\n";
    }

    // exports the variables and functions above so that other modules can use them
    module.exports.mlbMethods = mlbMethods;
}