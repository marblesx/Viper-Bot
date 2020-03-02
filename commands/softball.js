{

    const tabletojson = require('tabletojson');
    const SummerUrl = 'http://www.cuttingedgesports.net/statistics/su2team.htm';
    const FallUrl = 'http://www.cuttingedgesports.net/statistics/fa2team.htm';
    const SpringUrl = 'http://www.cuttingedgesports.net/statistics/sp2team.htm';

    const statNames =
        {
            0: 'Name',
            1: 'Games',
            2: 'AB',
            4: 'Runs',
            5: 'Hits',
            7: 'Doubles',
            8: 'Triples',
            9: 'Home runs',
            10: 'RBI',
            11: 'AVG',
            15: 'BB',
            16: 'SACF',
            17: 'RNC',

        };

    const stat =
        {
            name: 0,
            games: 1,
            ab: 2,
            runs: 4,
            hits: 5,
            doubles: 7,
            triples: 8,
            homeruns: 9,
            rbi: 10,
            avg: 11,
            bb: 15,
            sacf: 16,
            runc: 17
        };

    /**
     * Gets the players stats from the player object
     * @param {object} player
     * @returns {string}
     */
    function getPlayerStats(player) {
        return player[stat.name] + ', ' + player[stat.games] + ', ' + player[stat.ab] + ', ' + player[stat.runs] + ', ' + player[stat.hits] + ', ' + player[stat.doubles] + ', ' + player[stat.triples] + ', ' + player[stat.homeruns] + ', ' + player[stat.rbi] + ', ' + player[stat.avg] + ', ' + player[stat.bb]
    }
    /****
     *
     * @param {string} url
     * @param {object} bot
     * @constructor
     */
    function GetStats(url, bot) {
        tabletojson.convertUrl(
            url,
            function (tablesAsJson) {
                let returnMessage = '';
                let total = tablesAsJson[0].length;

                for (let i = 0; i < total; i++) {
                    if (tablesAsJson[0][i][0].includes('Slap A Pitch')) {

                        //first row is the wins lossess
                        //second column is the header
                        // players after that.
                        //blank row
                        //total

                        returnMessage += 'Slap A Pitch Stats\n';
                        i++;
                        let winsLosses = tablesAsJson[0][i][0].split(' ');
                        returnMessage += 'Wins: ' + winsLosses[1] + ' Losses: ' + winsLosses[4] + '\n';
                        returnMessage += statNames[0] + ", " + statNames[1] + ", " + statNames[2] + ", " + statNames[4] + ", " + statNames[5] + ", " + statNames[7] + ", " +
                            statNames[8] + ", " + statNames[9] + ", " + statNames[10] + ", " + statNames[11] + ", " + statNames[15] + '\n';
                        i++;
                        do {
                            if (tablesAsJson[0][i][0].split('').length > 2) {
                                returnMessage += getPlayerStats(tablesAsJson[0][i]) + '\n';
                            }
                            i++

                        } while (!tablesAsJson[0][i][0].includes('Total for Team'))
                        break;
                    }
                }
                if (returnMessage === '') {
                    returnMessage = "Opps Nothing to return";
                }

               bot.channel.send(returnMessage);
            }
        );
    }

    /**
     * This handles all the arg method calls for softball
     * @param {string[] } args
     * @param {object} bot
     */
    function softballMethods(args, bot) {

        switch (args[1]) {
            case 'help':
                bot.channel.send( "valid commands are: \n" +
                        "!sb.su \n" +
                        "!sb.sp \n" +
                        "!sb.fa \n"
                );
            case 'su':
                GetStats(SummerUrl, bot);
                break;
            case 'fa':
                GetStats(FallUrl, bot);
                break;
            case 'sp':
                GetStats(SpringUrl, bot);
                break;
            default:
               bot.channel.send("Invalid command, try !sb.help for a list of valid commands.");
        }
    }

    module.exports = {
        name: 'sb',
        description: 'Gets the command list for the Softball League.',
        execute(args, bot){
            softballMethods(args,bot);
        }
    };
}
