{
    module.exports = {

        /**
         * @returns {string} Returns the current date in mm/dd/yyyy format.
         * */
        getToDaysDateFormatted: function () {
            return new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", month: '2-digit', day: '2-digit', year: 'numeric' });
        },
        /**
         * @returns {string} returns the current date in yyyy/mm/dd format.
         * */
        getDateFormatted: function () {
            return new Date().toLocaleDateString("en-US", { timeZone: "America/New_York", year: 'numeric', month: '2-digit', day: '2-digit' });
        },
        /**
         * returns date as yyyymmdd string
         * @return {string}
         */
        getEuroFormattedDate: function()
        {
            let d = new Date(new Date().toLocaleTimeString("en-US", { timeZone: "America/New_York", year:'numeric', month:'2-digit', day: '2-digit' }));
                month = '' + (d.getMonth() + 1),
                 day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return year+month+day;
        },
        /**
         * @param {date} date Date object
         * @returns {string} Returns the date in mm/dd/yyyy format.
         * */
        formatDate: function (date) {
            return date.toLocaleDateString("en-US", { month: '2-digit', day: '2-digit', year: 'numeric' });
        },
        /**
         * @returns {Date} the current date object in EST.
         * */
        getToDaysDate: function () {
            return new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
        },
        /**
         * @param {string} time string format to convert.
         * @returns {string} date object
         * **/
        convertTime: function (time) {
            return new Date(time).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: '2-digit', minute: '2-digit' });
        },
        /**
         * Pass in the
         * @param {string}timeOfGame time in string format.
         * @returns {number} difference of time between current time and string in seconds.
         */
        getTimeDifferenceInSeconds: function (timeOfGame) {
            return (new Date(timeOfGame).getTime() - new Date().getTime()) / 1000;
        },
        /**
         * Gets a random number.
         * @param max {number} max number returned.
         * @returns {number} random number.
         */
        getRandomInt: function (max)
        {
            return Math.floor(Math.random() * Math.floor(max));
        },
        /**
         * Returns if string is blank or not.
         * @param userString {string}
         * @return {boolean}
         */
        isBlank: function (userString){
            return !userString;

        },
        /**
         * Returns if string is blank or not.
         * @param userString {string}
         * @return {boolean}
         */
        isNotBlank: function (userString){
          return !!userString;

        }

    };
}
