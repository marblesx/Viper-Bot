const {gifToken} = require('../auth');
const request = require('request');
const common = require('../Common/common');
let _bot;
function welcome(){

    request.get({
        url: `https://api.giphy.com/v1/gifs/search?api_key=${gifToken}&q=welcome&limit=25&offset=0&rating=G&lang=en`,
        json: true,
        headers: {'User-Agent': 'request'}
    }, (err, res, data) => {
        if (err) {
            console.log('Error:', err);
        } else if (res.statusCode !== 200) {
            console.log('Status:', res.statusCode);
            console.log(gifToken);
        } else {
            // data is already parsed as JSON:
            if (data.data.length !== 0) {
                let num = common.getRandomInt(24);
                _bot.channel.send(data.data[num].url);
            }
        }
    });
}


module.exports = {
    name: 'welcome',
    description: 'Welcomes users with a random gif',
    execute: function (args, bot) {
        _bot = bot;
        welcome();
    }
};
