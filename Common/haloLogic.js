{
    const appName = 'halo';

    const {haloGameLimit} = require('../config.json');
    const haloDAL = require('../dataAccessLayer/haloDAL');
    const common = require('../Common/common');
    const {halo5ApiKey} = require('../auth');
    const halo5Api = new (require("haloapi"))(halo5ApiKey);

    const lib = require('lib');
    const mcc = lib.halo.mcc['@0.0.11'];
    const Discord = require('discord.js');
    const halo5 = "h5";
    let _bot;

    const h5DaysRegex = /\d+[D][T]/g;
    const h5HoursRegex = /\d+[H]/g;
    const h5MRegex = /\d+[M]/g;
    const h5SecondsRegex = /[M]\d+/g;

    const lastGameRegex = /\d+[a]/g;
    const digitsRegex = /\d+/g;
    let slayerGame = "Slayer";
    let ctfGame = "CTF";
    let kothGame = "KOTH";
    let juggernautGame = "Juggernaut";
    let infectionGame = "Infection";
    let floodGame = "Flood";
    let raceGame = "Race";
    let extractionGame = "Extraction";
    let dominionGame = "Dominion";
    let regicideGame = "Regicide";
    let grifballGame = "Grifball";
    let ricochetGame = "Ricochet";
    let vipGame = "VIP";
    let territoriesGame = "Territories";
    let assualtGame = "Assault";


    const maps = [
        'Pillar of Autumn',
        'Halo',
        'Truth and Reconciliation',
        'Silent Cartographer',
        '343 guilty spark',
        'the library',
        'two betrayals',
        'keyes',
        'the maw',
        'battle creek',
        'sidewinder',
        'damnation',
        'rat race',
        'prisoner',
        'hang em high',
        'chill out',
        'derelict',
        'boarding action',
        'chiron',
        'blood gulch',
        'wizard',
        'longest',
        'death island',
        'danger canyon',
        'infinity',
        'timberland',
        'ice fields',
        'gephyrophobia',
        'the heretic',
        'the armory',
        'cairo station',
        'outskirts',
        'metropolis',
        'the arbiter',
        'the oracle',
        'delta halo',
        'regret',
        'sacred icon',
        'quarantine zone',
        'gravemind',
        'uprising',
        'high charity',
        'the great journey',
        'lockout',
        'ascension',
        'midship',
        'ivory tower',
        'beaver creek',
        'burial mounds',
        'colossus',
        'zanzibar',
        'coagulation',
        'headlong',
        'waterworks',
        'foundation',
        'containment',
        'warlock',
        'sanctuary',
        'turf',
        'backwash',
        'elongation',
        'gemini',
        'relic',
        'terminal',
        'desolation',
        'tombstone',
        'district',
        'uplift',
        'arrival',
        'sierra 117',
        'crows nest',
        'tsavo highway',
        'the storm',
        'floodgate',
        'the ark',
        'the covenant',
        'cortana',
        'halo',
        'construct',
        'epitaph',
        'guardian',
        'high ground',
        'isolation',
        'last resort',
        'narrows',
        'sandtrap',
        'snowbound',
        'the pit',
        'valhalla',
        'foundry',
        'rats nest',
        'standoff',
        'avalanche',
        'blackout',
        'ghost town',
        'cold storage',
        'assembly',
        'orbital',
        'sandbox',
        'citadel',
        'heretic',
        'longshore',
        'prologue',
        'dawn',
        'requiem',
        'forerunner',
        'infinity',
        'reclaimer',
        'shutdown',
        'composer',
        'midnight',
        'epilogue',
        'multiplayer first DONOTUSE OR REMOVE',
        'adrift',
        'abandon',
        'complex',
        'exile',
        'haven',
        'longbow',
        'meltdown',
        'ragnarok',
        'solace',
        'vortex',
        'ravine',
        'impact',
        'erosion',
        'forge island',
        'wreckage',
        'harvest',
        'shatter',
        'landfall',
        'monolith',
        'skyline',
        'daybreak',
        'outcast',
        'perdition',
        'pitfall',
        'vertigo',
        'spartan ops first DONOTUSE OR REMOVE',
        'chopperbowl',
        'sniperalley',
        'fortsw',
        'temple',
        'scurve',
        'courtyard',
        'complex',
        'valhalla',
        'factory',
        'mezzanie',
        'caverns',
        'vortex',
        'breach',
        'hillside',
        'engine',
        'groundhog lockout',
        'groundhog ascension',
        'groundhog zanzibar',
        'groundhog coagulation',
        'groundhog warlock',
        'groundhog sanctuary',
        'groundhog forge skybox01',
        'groundhog forge skybox02',
        'groundhog forge skybox03',
        'extracredit first DONOTUSE OR REMOVE',
        'epilogue',
        'prepare to drop',
        'mombasa streets',
        'tayari plaza',
        'uplift reserve',
        'kizingo boulevard',
        'oni alpha site',
        'nmpd hq',
        'kikowani station',
        'data hive',
        'coastal highway',
        'epilogue',
        'groundhog relic',
        'noble actual',
        'winter contingency',
        'oni sword base',
        'nightfall',
        'tip of the spear',
        'long night of solace',
        'exodus',
        'new alexandria',
        'the package',
        'the pillar of autumn',
        'the pillar of autumn credits',
        'lone wolf',
        'boardwalk',
        'boneyard',
        'countdown',
        'powerhouse',
        'reflection',
        'spire',
        'sword base',
        'zealot',
        'anchor 9',
        'breakpoint',
        'tempest',
        'condemned',
        'highlands',
        'battle canyon',
        'penance',
        'ridgeline',
        'solitary',
        'high noon',
        'breakneck',
        'forge world',
        'beachhead',
        'corvette',
        'courtyard',
        'glacier',
        'holdout',
        'outpost',
        'overlook',
        'waterfront',
        'unearthed',
        'installation 04',

    ];

    async function HaloCommands(bot, command, args) {
        _bot = bot;


        switch (command) {

            case "register":
               await haloRegisterUser(args);
                break;
            case "deregister":
                 await  haloDeregisterUser(args);
                break;
            case "list":
                _bot.channel.send("coming soon");
                break;
            default:
                if(command === 'me'){
                    if(await haloDAL.isUserRegistered(_bot.author.id)){
                        const gamerTag = await haloDAL.findRegisteredUser(_bot.author.id)
                        getHaloMccStats(gamerTag[0].userGamerTag, args)
                    }else{
                        _bot.channel.send(`Sorry <@${_bot.author.id}>, you need to register; try halo.register.gamertag.nickname`)
                    }
                }
                else if(!(await haloDAL.isNickNameAvailable(command))){
                    const user = await haloDAL.getUserByNickname(command);
                    getHaloMccStats(user[0].userGamerTag, args)
                }
                else{
                    getHaloMccStats(command, args);
                }
        }
    }
    async function Halo5Commands(bot, command, args){
        _bot = bot;
        switch (command) {

            case "register":
                await haloRegisterUser(args);
                break;
            case "deregister":
                await  haloDeregisterUser(args);
                break;
            case "list":
                _bot.channel.send("coming soon");
                break;
            default:
                if(command === 'me'){
                    if(await haloDAL.isUserRegistered(_bot.author.id)){
                        const gamerTag = await haloDAL.findRegisteredUser(_bot.author.id)
                        getHalo5Stats(gamerTag[0].userGamerTag, args)
                    }else{
                        _bot.channel.send(`Sorry <@${_bot.author.id}>, you need to register; try halo.register.gamertag.nickname`)
                    }
                }
                else if(!(await haloDAL.isNickNameAvailable(command))){
                    const user = await haloDAL.getUserByNickname(command);
                    getHalo5Stats(user[0].userGamerTag, args)
                }
                else{
                    getHalo5Stats(command, args);
                }
        }
    }

    function getHaloUsersList(){
        
    }

    async function haloDeregisterUser(args){
        if(await haloDAL.isUserRegistered(_bot.author.id)) {
            const user = await haloDAL.findRegisteredUser(_bot.author.id)
            await haloDAL.deregisterUser(user[0]);
            _bot.channel.send(`User <@${_bot.author.id}> is no longer registered.`);
        }
        else{
            _bot.channel.send(`User <@${_bot.author.id}> is not registered.`);

        }
    }

    async function  haloRegisterUser(args){
        if(await haloDAL.isNickNameAvailable(args[3].toLowerCase())) {
            if (await haloDAL.isUserRegistered(_bot.author.id)) {
                _bot.channel.send("User is already registered, updating with new gamertag and nickname.");
                let gamerTag = await haloDAL.findRegisteredUser(_bot.author.id)
                gamerTag = gamerTag[0];
                gamerTag.userGamerTag = args[2];
                gamerTag.userNickName = args[3].toLowerCase();
                await haloDAL.updateRegisteredUser(gamerTag);
                _bot.channel.send(`User <@${gamerTag.userGuid}> is updated to GT: ${gamerTag.userGamerTag} and nickname ${gamerTag.userNickName}`);
            } else {
                _bot.channel.send("User is not registered, registering with new gamertag and nickname.");
                let newUser = await haloDAL.getHaloUserObj();
                newUser.userGuid = _bot.author.id;
                newUser.userGamerTag = args[2];
                newUser.userNickName = args[3];
                await haloDAL.registerUser(newUser);
                _bot.channel.send(`User <@${newUser.userGuid}> is registered to GT: ${newUser.userGamerTag} and nickname ${newUser.userNickName}`);
                _bot.channel.send(`<@${newUser.userGuid}> use command halo.me or halo.nickname to get stats`);

            }
        }else{
            _bot.channel.send(`User <@${_bot.author.id}> nickname ${args[3].toLowerCase()} is already in use.`);
        }
    }

    function getLeaderBoard(args){
        
    }
    function getHalo5Stats(gamerTag, args) {
        if (common.isNotBlank(args[2])) {
            if (args[2].toLowerCase().match(lastGameRegex)) {
                let games = args[2].match(digitsRegex);
                if (parseInt(games) > 25) {
                    _bot.channel.send("Fuck off wanker, keep it 25 and under.");
                } else {
                    lastXGamesHalo5(gamerTag, games[0], true);
                }
            } else {
                let games = args[2].match(digitsRegex);
                if (parseInt(games) > parseInt(haloGameLimit)) {
                    _bot.channel.send("Fuck off wanker, keep it 10 and under.");
                } else {
                    lastXGamesHalo5(gamerTag, games[0], false);
                }
            }
        } else {
            callBasicStatsHalo5(gamerTag);
        }
    }

    function callBasicStatsHalo5(userGamerTag) {
        halo5Api.stats.serviceRecordArena(userGamerTag).then((result) => {
            result = result.Result;
            let ArenaStats = result.ArenaStats;
            let gameEmbed = new Discord.MessageEmbed()
                .setColor('#b6d6eb')
                .setTitle(`Halo 5 Profile: ${userGamerTag}`)
                .setDescription(`${userGamerTag} game stats`)
                .addField("Kills", ArenaStats.TotalKills, true)
                .addField('Deaths', ArenaStats.TotalDeaths, true)
                .addField('Assists', ArenaStats.TotalAssists, true)
                .addField('Accuracy', '%'+((ArenaStats.TotalShotsLanded / ArenaStats.TotalShotsFired).toFixed(2) * 100), true)
                .addField("Games Won", ArenaStats.TotalGamesWon, true)
                .addField("Games Lost", ArenaStats.TotalGamesLost, true)
                .addField('Time Played', getHalo5TimePlayedAsString(ArenaStats.TotalTimePlayed), true)
            _bot.channel.send(gameEmbed);
        });
    }

    function getHalo5TimePlayedAsString(haloTimePlayed){
        let Days = haloTimePlayed.match(h5DaysRegex);
        let Hours = haloTimePlayed.match(h5HoursRegex);
        let Mins = haloTimePlayed.match(h5MRegex);
        let Seconds = haloTimePlayed.match(h5SecondsRegex);
        return `Played for ${Days.length === 1 ? Days[0].match(digitsRegex) : 0} days ${Hours.length === 1 ? Hours[0].match(digitsRegex) : 0} hours
         ${Mins.length === 1 ? Mins[0].match(digitsRegex): 0} mins and ${Seconds.length === 1? Seconds[0].match(digitsRegex): 0} seconds`;
    }

    function getHaloMccStats(gamerTag, args) {
        if (common.isNotBlank(args[2])) {
            if (args[2].toLowerCase().match(lastGameRegex)) {
                let games = args[2].match(digitsRegex);
                lastXGamesHaloMcc(gamerTag, games[0], true);
            } else {
                let games = args[2].match(digitsRegex);
                if (parseInt(games) > parseInt(haloGameLimit)) {
                    _bot.channel.send("Fuck off wanker, keep it 10 and under.");
                } else {
                    lastXGamesHaloMcc(gamerTag, games[0], false);
                }
            }
        } else {
            callBasicStatsHaloMcc(gamerTag);
        }
    }

    function lastXGamesHalo5(gamerTag, gamesNum, average) {
        gamesNum = parseInt(gamesNum);

        halo5Api.stats.playerMatches({
                player: gamerTag,
                modes: "arena,warzone",
                start: 0,
                count: gamesNum
            }).then((result) => {
                let games = result.Results;
            if (average) {
                let game = {};
                game.kills = 0;
                game.deaths = 0;
                game.assists = 0;
                game.killsAvg = 0;
                game.deathsAvg = 0;
                game.assistsAvg = 0;
                game.KD = 0;
                game.SE = 0;
                for (let i = 0; i < games.length; i++) {
                    game.kills += parseInt(games[i].Players[0].TotalKills);
                    game.deaths += parseInt(games[i].Players[0].TotalDeaths);
                    game.assists += parseInt(games[i].Players[0].TotalAssists);
                }
                game.killsAvg = (game.kills / gamesNum).toFixed(2);
                game.deathsAvg = (game.deaths / gamesNum).toFixed(2);
                game.assistsAvg = (game.assists / gamesNum).toFixed(2);
                game.KD = (game.kills / game.deaths).toFixed(2);
                game.SE = (((game.kills + game.assists) / (game.kills + game.assists + game.deaths)) * 100).toFixed(2);
                gameCardAvgHaloMcc(game, gamerTag, gamesNum);
            } else {
                for (let i = 0; i < gamesNum; i++) {
                    gameCardHaloMcc(games[i], gamerTag, i + 1);
                }
            }
            });




    }

    function lastXGamesHaloMcc(gamerTag, gamesNum, average) {
        gamesNum = parseInt(gamesNum);
        let slayer = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: slayerGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = slayerGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let ctf = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: ctfGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = ctfGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let juggernaut = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: juggernautGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = juggernautGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let koth = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: kothGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = kothGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let infection =mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: infectionGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = infectionGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let flood = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: floodGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = floodGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let race = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: raceGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = raceGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let extraction = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: extractionGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = extractionGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let dominion = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: dominionGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = slayerGame;
            })
            return dominionGame;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let regicide = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: regicideGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = regicideGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let grifball = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: grifballGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = grifballGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let ricochet = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: ricochetGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = ricochetGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let vip_g = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: vipGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = vipGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let territorie = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: territoriesGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = territoriesGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );
        let assualt = mcc.games.history({
            gamertag: gamerTag,
            game: 'All',
            gameVariant: assualtGame,
            count: gamesNum
        }).then((result) => {
            result.games.forEach(game => {
                game.gameType = assualtGame;
            })
            return result;
        }).catch(error =>
            _bot.channel.send(error.message)
        );


        Promise.all([slayer, ctf, assualt, territorie, vip_g, ricochet, dominion, extraction,
            race, flood, infection, juggernaut, koth,regicide,grifball]).then((values) => {
            const games = [];

            for (let c = 0; c < values.length; c++) {
                if (values[c].games != undefined) {
                    for (let g = 0; g < values[c].games.length; g++) {
                        games.push(values[c].games[g]);
                    }
                }
            }
            games.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
            if (average) {
                let game={};
                game.kills =0;
                game.deaths = 0;
                game.assists = 0;
                game.killsAvg = 0;
                game.deathsAvg = 0;
                game.assistsAvg=0;
                game.KD = 0;
                game.SE=0;
                for (let i = 0; i < gamesNum; i++) {
                    game.kills+= parseInt(games[i].kills);
                    game.deaths+= parseInt(games[i].deaths);
                    game.assists+= parseInt(games[i].assists);
                }
                game.killsAvg = (game.kills / gamesNum).toFixed(2);
                game.deathsAvg = (game.deaths / gamesNum).toFixed(2);
                game.assistsAvg=(game.assists / gamesNum).toFixed(2);
                game.KD = (game.kills / game.deaths).toFixed(2);
                game.SE=(((game.kills + game.assists ) / (game.kills + game.assists + game.deaths)) * 100).toFixed(2);
                gameCardAvgHaloMcc(game, gamerTag, gamesNum);
            } else {
                for (let i = 0; i < gamesNum; i++) {
                    gameCardHaloMcc(games[i], gamerTag, i + 1);
                }
            }
        });
    }

    function callBasicStatsHaloMcc(userGamerTag) {

        mcc.stats({
            gamertag: userGamerTag
        }).then((result) => {
            playerCardHaloMcc(result)
        }).catch(error =>
            _bot.channel.send(error.message)
        );

    }

    function playerCardHaloMcc(player) {
        const helpEmbed = new Discord.MessageEmbed()
            .setColor('#b6d6eb')
            .setTitle(`Service Record: ${player.gamertag}`)
            .setDescription(`${player.gamertag} is part of ${player.clantag} and has played for ${player.playtime}`)
            .setThumbnail(player.emblem)
            .addField( "Wins", player.wins, true)
            .addField("Losses",  player.losses,true)
            .addField("Win Rate", "%"+(player.winRatio.toFixed(2) * 100).toFixed(0),true)
            .addField("Kills",  player.kills,true)
            .addField("Deaths",  player.deaths,true)
            .addField("KD",  player.killDeathRatio.toFixed(2),true)
            .addField("Kills per game",  player.killsPerGame.toFixed(2),true)
            .addField("Deaths per game",  player.deathsPerGame.toFixed(2),true)
        _bot.channel.send(helpEmbed);
    }


    function gameCardHaloMcc(game,gamerTag, gamenum) {
        let gameEmbed = new Discord.MessageEmbed()
            .setColor('#b6d6eb')
            .setTitle(`Game Record ${gamenum}: ${gamerTag}`)
            .setDescription(`${gamerTag} game stats`)
            .addField('GameType', game.gameType)
            //.addField('Map', maps[game.mapId])
            .addField("Outcome", game.won ? 'Won' : 'Lost')
            .addField('Kills', game.kills,true)
            .addField('Deaths', game.deaths,true)
            .addField('Assists', game.assists, true)
            .addField('Played',new Date(game.playedAt).toString() )
        gameEmbed=additionalStatsHaloMcc(gameEmbed,game);

        _bot.channel.send(gameEmbed);
    }

    function gameCardAvgHaloMcc(game,gamerTag, gameNum) {
        let gameEmbed = new Discord.MessageEmbed()
            .setColor('#b6d6eb')
            .setTitle(`Average Game Record for last ${gameNum} games: ${gamerTag}`)
            //.addField('Map', maps[game.mapId])
            .addField('Kills', game.kills,true)
            .addField('Deaths', game.deaths,true)
            .addField('Assists', game.assists, true)
            .addField('Avg Kills', game.killsAvg, true)
            .addField('Avg Deaths', game.deathsAvg, true)
            .addField('Avg Assists', game.assistsAvg, true)
            .addField('KD', game.KD, true)
            .addField('Successful Engagements %', game.SE, true)

        _bot.channel.send(gameEmbed);
    }

    function additionalStatsHaloMcc(gameEmbed, game){
        switch(game.gameType){
            case kothGame:
                gameEmbed.addField("Time in hill", game.score);
                break;
            case ctfGame:
                gameEmbed.addField("Flags captured", game.score);
                break;
        }

        return gameEmbed
    }


    module.exports.haloLogic = HaloCommands;
    module.exports.halo5Logic = Halo5Commands;

}
