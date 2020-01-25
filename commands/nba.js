{
    const common = require('../Common/common');
    const request = require('request');
    const request_sync = require('sync-request');


    let baseUrl = 'http://data.nba.net/prod/';
    let v1 = 'v1';
    let v2 = 'v2';
    let scoreboard = '/scoreboard.json';
    let _bot;

    let nbaTeams = {};


    /**
     * This handles all the arg method calls for nba
     * @param {string[] } args list of arguments
     * @param {object} bot bot object
     */
    function mlbMethods(args, bot) {
        switch (args[1]) {
            case 'help':
                _bot.channel.send("valid commands are: \n" +
                    "!nba.games \n"
                );
                break;
            case 'games':
                getTodaysGames();
                break;
            case 'standings':
                break;
            default:
                _bot.channel.send("Invalid command, try !nba.help for a list of valid commands.");
        }
    }

    function cacheTeams() {
        if (Object.keys(nbaTeams).length === 0) {

            let today = request_sync('GET', baseUrl + 'v1/today.json');
            let returned = request_sync('GET', 'http://data.nba.net' + JSON.parse(today.getBody('utf8')).links.teams)
            let teams = JSON.parse(returned.getBody('utf8'));
            for (let league in teams.league) {
                teams.league[league].forEach(team => {
                    if (team.isNBAFranchise) {
                        if(!(team.teamId in nbaTeams)) {
                            nbaTeams[team.teamId] = team.nickname;
                        }
                    }
                });
            }
        }
    }

    /**
     *
     * @param game game object
     * @return {string} current status
     */
    function gameStatus(game) {
        let toReturn = "";
        toReturn += nbaTeams[game.hTeam.teamId] + (game.hTeam.score > game.vTeam.score ? " beating the " : " losing to the") + nbaTeams[game.vTeam.teamId] + " " + game.hTeam.score+ " - "+game.vTeam.score + " ";
        if(game.period.isEndOfPeriod)
        {
            toReturn += `End of the ${getQrt(game.period.current)}`
        }
        else
        {
            toReturn += `${game.clock} remaining in the ${getQrt(game.period.current)}`
        }
        return toReturn+"\n";
    }

    /**
     *
     * @param num qrt number
     * @return {string} text of the current qrt
     */
    function getQrt(num) {
        let message = "";
        switch(num)
        {
            case 1:message = "1st";
                break;
            case 2:message = "2nd";
                break;
            case 3:message = "3rd";
                break;
            case 4:message = "4th";
                break;
        }
        return message;

    }

     function getTodaysGames() {
        let message = "";
        request.get({
            url: baseUrl + v2 + '/' + common.getEuroFormattedDate() + scoreboard,
            json: true,
            headers: {'User-Agent': 'request'}
        }, (err, res, data) => {
            if (err) {
                console.log('Error:', err);
            } else if (res.statusCode !== 200) {
                console.log('Status:', res.statusCode);
            } else {
                // data is already parsed as JSON:
                if (data.games.length) {
                    data.games.forEach(game => {
                        /**
                         * we're going to switch based on the status, 3 means the game is over, 2 is game in progress, 1 is game is not started.
                         */
                        switch (game.statusNum) {
                            case 1: message += `${nbaTeams[game.hTeam.teamId]} vs ${nbaTeams[game.vTeam.teamId]} at ${common.convertTime(game.startTimeUTC)} \n`;
                                break;
                            case 2:message += gameStatus(game);
                                break;
                            case 3: message += `${nbaTeams[game.hTeam.teamId]} ${(game.hTeam.score > game.vTeam.score ?"beat the" : "lost to the")} ${nbaTeams[game.vTeam.teamId]} ${game.hTeam.score} - ${game.vTeam.score} \n`;
                                break;
                            default:
                                break;
                        }
                    });
                    _bot.channel.send(message);
                }
            }
        });
    }

    module.exports = {
        name: "nba",
        description: "Command to retrieve nba games, stats and other headlines.",
        execute(args, bot) {
            _bot =bot;
            cacheTeams();
            mlbMethods(args,_bot);
        }
    };
}
