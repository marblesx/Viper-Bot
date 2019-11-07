{
    //import required files for discord bot.
    const common = require('../common/common');
    const request = require('request');
    const request_sync = require('sync-request');

    let VERSION_1 = 'v1';
    let BASE_URL = 'http://data.nba.net/prod/' + VERSION_1;

    let _bot;
    let _channelID;

    /**
     * This handles all the arg method calls for NBA
     * @param {string[] } args
     * @param {object} bot
     * @param {int}channelId
     */
    function nhlMethods(args, bot, channelId) {
        _bot = bot;
        _channelID = channelId;
        switch (args[1]) {
            case 'help':
                _bot.sendMessage({
                    to: _channelID,
                    message: "valid commands are: \n" +
                        "!nba.games \n"
                });
            case 'games':
                gamesToday();
                break;
            default:
                _bot.sendMessage({
                    to: _channelID,
                    message: "Invalid command, try !nba.help for a list of valid commands."
                });
        }
    }

    /***
     * Retrieves the current games for the current date, if they've been played, are being played, or are yet to play.
     * */
    function gamesToday() {
        let message = '';
        let date = common.getDateFormatted().replace('/','');
        request.get({
            url: TODAY_GAMES_URL +'/' +date + '/scoreboard.json',
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if (err) {
                console.log('Error:', err);
            } else if (res.statusCode !== 200) {
                console.log('Status:', res.statusCode);
            } else {
                // data is already parsed as JSON:
                if (data.numGames !== 0) {
                    let games = data.games;
                    message += "Away team first, home team second: \n";
                    for (let i = 0; i < games.length; i++) {
                        message += gameStatus(games[i].status, games[i].vTeam, games[i].hTeam, games[i]);
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
     * @param {object} status : the Status object of the current game
     * @param {object} awayTeam : the team object for the away team.
     * @param {object} homeTeam : the team object for the home team.
     * @param {object} gameData : The Current game data object.
     */
    function gameStatus(status, awayTeam, homeTeam, gameData) {
        let toReturn = '';
        let awayTeamName = getTeamName(awayTeam.team.id);

        let homeTeamName = getTeamName(homeTeam.team.id);

        switch (status.detailedState) {
            case Postponed:
                toReturn = "The game between " +  awayTeamName + " and " + homeTeamName + " is postponed due to " + status.reason
                break;
            case currentGame:
                if (awayTeam.score + homeTeam.score === 0) {
                    toReturn = awayTeamName + " and " + homeTeamName + " are scoreless: " + awayTeam.score + "-" + homeTeam.score;
                } else if (awayTeam.score === homeTeam.score) {
                    toReturn = awayTeamName + " and " + homeTeamName + " are tied: " + awayTeam.score + "-" + homeTeam.score;
                } else if (awayTeam.score > homeTeam.score) {
                    toReturn = awayTeamName + " are beating " + homeTeamName + ": " + awayTeam.score + "-" + homeTeam.score;
                } else {
                    toReturn = awayTeamName + " are losing to " + homeTeamName + ": " + awayTeam.score + "-" + homeTeam.score;
                }
                break;
            case Scheduled:
            case PreGame:
                toReturn = awayTeamName + " are visiting " + homeTeamName + " at " + common.convertTime(gameDate);
                break;
            case FinalGame:
            case GameOver:
                if (awayTeam.score > homeTeam.score) {
                    toReturn = awayTeamName + "  beat " + homeTeamName + ": " + awayTeam.score + "-" + homeTeam.score;
                } else {
                    toReturn = awayTeamName + " lost to " + homeTeamName + ": " + awayTeam.score + "-" + homeTeam.score;
                }
                break;
            default:
                toReturn = "Well folks, we have no idea whats going on this game between "+awayTeamName +" and "+homeTeamName + ". We can assume its due to something called: \""+status.detailedState+ "\"";
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


}
