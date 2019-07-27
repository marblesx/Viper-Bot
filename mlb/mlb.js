{
    const common = require('../Common/common');
    const request = require('request');
    const request_sync = require('sync-request');

    let VERSION_1 = 'v1';
    let BASE_URL = 'https://statsapi.mlb.com/api/' + VERSION_1;
    let TODAY_GAMES_URL = BASE_URL + '/schedule/games/?sportId=1';
    let TEAM_URL = BASE_URL + '/teams/';

    const currentGame = "In Progress";
    const PreGame = "Pre-Game";
    const FinalGame = "Final";
    const Scheduled = "Scheduled";
    const GameOver = "Game Over";
    const Phillies_ID = '143';
    let Phillies_Location = '';
    let _bot;
    let _channelID;

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
            case 'help':
                _bot.sendMessage({
                    to: _channelID,
                    message: "valid commands are: \n" +
                        "!mls.games"
                });
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
        request.get({
            url: TODAY_GAMES_URL + '&date=' + date,
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
                    message += "Away team first, home team second: \n";
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
        let awayTeamName = getTeamName(awayTeam.team.id);

        let homeTeamName = getTeamName(homeTeam.team.id);

        switch (status) {
            case currentGame:
                if (awayTeam.score === homeTeam.score) {
                    toReturn = awayTeamName + " and " + homeTeamName + " are tied: " + awayTeam.score + "-" + homeTeam.score;
                } else if (awayTeam.score > homeTeam.score) {
                    toReturn = awayTeamName + " are beating " + homeTeamName + ": " + awayTeam.score + "-" + homeTeam.score;
                } else {
                    toReturn = awayTeamName + " are loosing to " + homeTeamName + ": " + awayTeam.score + "-" + homeTeam.score;
                }
                break;
            case Scheduled:
            case PreGame:
                toReturn = awayTeamName + " are playing " + homeTeamName + " at " + common.convertTime(gameDate);
                break;
            case FinalGame:
            case GameOver:
                if (awayTeam.score > homeTeam.score) {
                    toReturn = awayTeamName + "  beat " + homeTeamName + ": " + awayTeam.score + "-" + homeTeam.score;
                } else {
                    toReturn = awayTeamName + " lost to " + homeTeamName + ": " + awayTeam.score + "-" + homeTeam.score;
                }
                break;
        }
        return toReturn + "\n";
    }

    /**
     * @param {string | int } id ID of the Team
     * @returns {string} Team Name IE Phillies
     */
    function getTeamName(id) {
        let res = request_sync('GET', TEAM_URL + id);
        return JSON.parse(res.getBody('utf8')).teams[0].teamName;
    }

    function philliesLive() {
        while (true) {

            let date = common.getToDaysDate();
            let url = TODAY_GAMES_URL + '&date=' + date;

        }


    }

    /**
     * @param {string} message : Message to send to channel.
     * */
    function UpdateChannel(message) {
        _bot.sendMessage({
            to: _channelID,
            message: message
        });
    }

    // exports the variables and functions above so that other modules can use them
    module.exports.mlbMethods = mlbMethods;
}