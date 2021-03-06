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
    const Phillies_ID = '143';
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
                gamesToday();
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

    function PhilliesNextGame() {
        //set the start of this up, we're going to get the formatted date, and the current date object
        let dateFormatted = common.getToDaysDateFormatted();
        let toDaysDate = common.getToDaysDate();
        //set the url to todays date est.
        let scheduleUrl = TODAY_GAMES_URL + '&date=' + dateFormatted;
        //blank object, we'll generate this.
        let gameObject = {};
        while (gameObject.game === undefined) {
            let response = request_sync('GET', scheduleUrl);
            let schedule = JSON.parse(response.getBody('utf8'));
            if (schedule.dates.length !== 0) {
                let games = schedule.dates[0].games;
                for (let i = 0; i < games.length; i++) {
                    //if the phillies match any of the teams (away/home)
                    if (games[i].teams.away.team.id.toString() === Phillies_ID || games[i].teams.home.team.id.toString() === Phillies_ID) {
                        //save the game
                        gameObject.game = games[i];
                        // game id
                        gameObject.Phillies_GameID = games[i].gamePk;
                        //if the game is starting... or started set timeout to -1
                        if (games[i].status.detailedState === currentGame || games[i].status.detailedState === PreGame) {
                            gameObject.timeout = -1;
                        } else if (games[i].status.detailedState === FinalGame || games[i].status.detailedState === GameOver) {
                            gameObject.game = undefined;
                        } else {
                            //if its not we'll set the timeout to the start time.. we're going to run in to issues due to game delays.
                            gameObject.timeout = common.getTimeDifferenceInSeconds(games[i].gameDate);
                        }
                        //some of the mlb apis dont care about teams id, just away/home status.. we need to save this.
                        if (games[i].teams.away.team.id.toString() === Phillies_ID) {
                            gameObject.Phillies_Location = 'away';
                        } else {
                            gameObject.Phillies_Location = 'home';
                        }
                        break; //Break the for loop.
                    }
                }
            }
            //check game property, if its not set, check the next day (do this FOREVER..lets break this after x amount of tries... )
            if(gameObject.game === undefined)
            {
                //get the next day.
                toDaysDate = new Date(toDaysDate.setDate(toDaysDate.getDate() + 1));
                dateFormatted = common.formatDate(toDaysDate);
                //set the new url.
                scheduleUrl = TODAY_GAMES_URL + '&date=' + dateFormatted;
            }
        }
        return gameObject;
    }

    /**
     * @param {string} message : Message to send to channel.
     * */
    function UpdateChannel(message) {
        _bot.channel.send(message);
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
