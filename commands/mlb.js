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
    const Postponed = "Postponed";
    //const Phillies_ID = '143';
    let cache_teams ={};
    let cache_teamCodes ={};
    let _bot;
    const NLCode= 104;
    const ALCode = 103;

    /**
     * This handles all the arg method calls for mlb
     * @param {string[] } args list of arguments  
     * @param {object} bot bot object
     */
    function mlbMethods(args, bot) {
        _bot = bot;
        switch (args[1]) {
            case 'help':
                _bot.channel.send("valid commands are: \n" +
                        "!mlb.games \n"
                );
                break;
            case 'games':
                gamesToday().then(g=>console.log(g));
                break;
            default:
                bot.channel.send("Invalid command, try !mlb.help for a list of valid commands.");
        }
    }

    /**
     * Sets up the team names.
     */
    function cacheTeams() {
        if (Object.entries(cache_teams).length === 0) {
            let res = request_sync('GET', TEAM_URL);
            let temp = JSON.parse(res.getBody('utf8')).teams;
            for (let i = 0; i < temp.length; i++) {
                if (temp[i].league.id === NLCode || temp[i].league.id === ALCode) {
                    cache_teams[temp[i].id] = {name: temp[i].teamName, teamCode: temp[i].abbreviation.toLowerCase()};
                    cache_teamCodes[temp[i].abbreviation.toLowerCase()] = temp[i].id;
                }
            }
        }
    }


    /***
     * Retrieves the current games for the current date, if they've been played, are being played, or are yet to play.
     * */
    async function gamesToday() {
        let message = '';
        let date = common.getToDaysDateFormatted();
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
                if (data.totalGames !== 0) {
                    let games = data.dates[0].games;
                    message += "Away team first, home team second: \n";
                    for (let i = 0; i < games.length; i++) {
                        message += gameStatus(games[i].status, games[i].teams.away, games[i].teams.home, games[i].gameDate);
                    }
                   _bot.channel.send(message);
                } else {
                   _bot.channel.send("No games today!, Boooooo");
                }
            }
        });
    }

    /**
     * @param {object} status : the Status object of the current game
     * @param {object} awayTeam : the team object for the away team.
     * @param {object} homeTeam : the team object for the home team.
     * @param {string} gameDate : The current Date of the game.
     * @returns {string} game status
     */
    function gameStatus(status, awayTeam, homeTeam, gameDate) {
        let toReturn;
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
        return toReturn + "\n";
    }

    /**
     * @param {string | int } id ID of the Team
     * @returns {string} Team Name IE Phillies
     */
    function getTeamName(id) {
       cacheTeams();
        return cache_teams[id].name;
    }


    // exports the variables and functions above so that other modules can use them
    module.exports = {
        name: 'mlb',
        description: 'Gets a list of games.',
        execute(args, bot){
            mlbMethods(args,bot);
        }
    };
}
