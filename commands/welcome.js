const {gifToken} = require('../auth');
const request = require('request');
const common = require('../Common/serverCommon');
let _bot;
function welcome(){

   common.welcome(_bot);
}


module.exports = {
    name: 'welcome',
    description: 'Welcomes users with a random gif',
    execute: function (args, bot) {
        _bot = bot;
        welcome();
    }
};
