{
    const common = require('../Common/common');
    const request = require('request');
    const request_sync = require('sync-request');

    let hostUrl = 'https://statsapi.web.nhl.com';
    let VERSION_1 = 'v1';
    let BASE_URL = 'https://statsapi.web.nhl.com/api/' + VERSION_1;
    let TODAY_GAMES_URL = BASE_URL + '/schedule';
    let TEAM_URL = BASE_URL + '/teams/';
    let FLYERS_ID = "4";

    let cache_teams ={};

    const currentGame = "In Progress";
    const PreGame = "Pre-Game";
    const FinalGame = "Final";
    const Scheduled = "Scheduled";
    const GameOver = "Game Over";
    const Postponed = "Postponed";

    let _bot;
    let _channelID;


    /**
     * This handles all the arg method calls for nhl
     * @param {string[] } args arguments for the bot.
     * @param {object} bot the bot object.
     * @param {int}channelId the channel ID it sends back to.
     */
    function nhlMethods(args, bot, channelId) {
        _bot = bot;
        _channelID = channelId;
        switch (args[1]) {
            case 'help':
                _bot.sendMessage({
                    to: _channelID,
                    message: "valid commands are: \n" +
                        "!nhl.games \n"
                });
                break;
            case 'games':
                gamesToday();
                break;
            default:
                _bot.sendMessage({
                    to: _channelID,
                    message: "Invalid command, try !nhl.help for a list of valid commands."
                });
        }
    }

    /***
     * Retrieves the current games for the current date, if they've been played, are being played, or are yet to play.
     * */
    function gamesToday() {
        let message = '';
        let date = common.getDateFormatted();
        request.get({
            url: TODAY_GAMES_URL + '?date=' + date,
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
                        message += gameStatus(games[i].status, games[i].teams.away, games[i].teams.home, games[i].gameDate, games[i]);
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
     * @param {string} gameDate : The current Date of the game.
     * @param {object} game: The game object.
     * @returns {string} the game status for the nhl.
     */
    function gameStatus(status, awayTeam, homeTeam, gameDate, game) {
        let toReturn = '';
        let awayTeamName = getTeamName(awayTeam.team.id);

        let homeTeamName = getTeamName(homeTeam.team.id);

        switch (status.detailedState) {
            case Postponed:
                toReturn = "The game between " + awayTeamName + " and " + homeTeamName + " is postponed due to " + status.reason;
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
        if(status.detailedState === currentGame)
        {
            let jsonObj = getLiveGame(game.link);
            let linescore = jsonObj.liveData.linescore;
            switch(linescore.currentPeriodTimeRemaining){
                case 'END':
                    break;
                default:
                    toReturn += ": " + linescore.currentPeriodOrdinal + " period, with " +linescore.currentPeriodTimeRemaining + " remaining.";
                    break;
            }
        }
        return toReturn + "\n";
    }

    /**
     * Sets up the team names.
     */
    function getTeams() {
        if (Object.entries(cache_teams).length === 0) {
            let res = request_sync('GET', TEAM_URL);
            let temp = JSON.parse(res.getBody('utf8')).teams;
            for (let i = 0; i < temp.length; i++) {
                cache_teams[temp[i].id] = temp[i].teamName;
            }
        }
    }

    /**
     * @param {string | int } id ID of the Team
     * @returns {string} Team Name IE Phillies
     */
    function getTeamName(id) {
         getTeams();
         return cache_teams[id];
    }

    /**
     * Gets the json data from a url
     * @param url {string } url string
     * @return jsonObject {object} Json returned value from URL.
     */
    function getLiveGame(url){
        let res = request_sync('GET',  hostUrl + url);
        return JSON.parse(res.getBody('utf8'));
    }
    // exports the variables and functions above so that other modules can use them
    module.exports = {
        name: 'nhl',
        description: 'Gets a list of nhl games, current scores, final scores.',
        execute(args, bot, channelID, userID){
            nhlMethods(args,bot, channelID);
        }
    };
}//end of the file
