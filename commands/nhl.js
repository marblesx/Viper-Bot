{
    const common = require('../Common/common');
    const request = require('request');
    const request_sync = require('sync-request');
    const Discord = require('discord.js');
    let hostUrl = 'https://statsapi.web.nhl.com';
    let VERSION_1 = 'v1';
    let BASE_URL = 'https://statsapi.web.nhl.com/api/' + VERSION_1;
    let TODAY_GAMES_URL = BASE_URL + '/schedule';
    let TEAM_URL = BASE_URL + '/teams/';
    let FLYERS_ID = "4";

    let cache_teams ={};
    let cache_teamCodes = {};

    const currentGame = "In Progress";
    const PreGame = "Pre-Game";
    const FinalGame = "Final";
    const Scheduled = "Scheduled";
    const GameOver = "Game Over";
    const Postponed = "Postponed";

    let _bot;

    /**
     * Returns the teams and their abbreviations.
     */
    function getTeams(){
        let teams = "";
        for(let tc in cache_teamCodes)
        {
            teams += `${cache_teams[cache_teamCodes[tc]].name} - team code is: ${tc} \n`;
        }
        _bot.channel.send(teams);
    }

    /**
     * This handles all the arg method calls for nhl
     * @param {string[] } args arguments for the bot.
     * @param {object} bot the bot object.
     * @param {int}channelId the channel ID it sends back to.
     */
    function nhlMethods(args, bot) {
        _bot = bot;
        switch (args[1]) {
            case 'help':
                const helpEmbed = new Discord.RichEmbed()
                    .setColor('#2dff16')
                    .setTitle('NHL Help Commands')
                    .setURL('https://github.com/marblesx')
                    .setAuthor('Dev Team', '', 'https://github.com/marblesx')
                    .setDescription('List of help and commands for the NHL commands.')
                    .addField('!nhl.games', 'Returns all the games for the current day and their scores.', true)
                    .addField('!nhl.teams', 'Returns all the teams in the NHL and their team code', true)
                    .addField('!nhl.{teamcode}.h', 'Returns all the highlights for the team if any. To find the teamcode use !nhl.teams and get the code you want.', true);
                _bot.channel.send(helpEmbed);
                break;
            case 'games':
                gamesToday();
                break;
            case 'teams':
                getTeams();
                break;
            default:
                if (args[1] in cache_teamCodes) {
                    if (args[2] == 'h') {
                        getHighlights(args[1].toLowerCase());
                    }
                } else {
                    _bot.channel.send("Invalid command, try !nhl.help for a list of valid commands.");
                }
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
                     _bot.channel.send( message);

                } else {
                    _bot.channel.send( "No games today!, Boooooo");
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
        let awayTeamName = getTeamName(awayTeam.team.id).name;
        awayTeamName = awayTeamName == undefined ? awayTeam.team.name : awayTeamName;
        let homeTeamName = getTeamName(homeTeam.team.id).name;
        homeTeamName = homeTeamName == undefined ? homeTeam.team.name : homeTeamName;

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
    function cacheTeams() {
        if (Object.entries(cache_teams).length === 0) {
            let res = request_sync('GET', TEAM_URL);
            let temp = JSON.parse(res.getBody('utf8')).teams;
            for (let i = 0; i < temp.length; i++) {
                cache_teams[temp[i].id] = {name: temp[i].teamName, teamCode: temp[i].abbreviation.toLowerCase()} ;
                cache_teamCodes[temp[i].abbreviation.toLowerCase()] = temp[i].id;
            }
        }
    }

    /**
     * Gets the highlights of a team if they have any.
     * @param teamCode {string} 3 character Id of NHL team.
     */
    function getHighlights(teamCode) {
        let noHLMessage = `Sorry, no highlights for ${cache_teams[cache_teamCodes[teamCode]].name}.`;
        let highlights = false;
        let gameID = 0;
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
                        for (let i = 0; i < games.length; i++) {
                            if (games[i].teams.away.team.id == cache_teamCodes[teamCode] || games[i].teams.home.team.id == cache_teamCodes[teamCode]) {
                                gameID = games[i].gamePk;
                                highlights = true;
                                break;
                            }
                        }
                    } else {
                        _bot.channel.send(noHLMessage);
                    }
                    if (highlights) {
                        let res = request_sync('GET', BASE_URL + `/game/${gameID}/content`);
                        let temp = JSON.parse(res.getBody('utf8'));
                        let highlightsjson = temp.highlights;
                        let count = 0;
                        if (highlightsjson.gameCenter.length !== 0) {
                            let teamID = cache_teamCodes[teamCode];
                            let hl = highlightsjson.gameCenter.items;
                            for (let v = 0; v < hl.length; v++) {
                                if (hl[v].keywords.find(k => k.type === 'teamId').value == teamID) {
                                    _bot.channel.send(hl[v].description);
                                    _bot.channel.send(hl[v].playbacks.find(p => p.name == 'FLASH_1800K_896x504').url);
                                    count++;
                                }
                            }
                            if (count == 0) {
                                _bot.channel.send(noHLMessage);
                            }
                        } else {
                            _bot.channel.send(noHLMessage);
                        }
                    } else {
                        _bot.channel.send(noHLMessage);
                    }
                }
            });
        }
    }


    /**
     * @param {string | int } id ID of the Team
     * @returns {string} Team Name IE Phillies
     */
    function getTeamName(id) {
        cacheTeams();
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
        execute(args, bot){
            cacheTeams();
            nhlMethods(args,bot);
        }
    };
}//end of the file
