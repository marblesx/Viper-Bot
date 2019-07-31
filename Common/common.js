
module.exports = {

    /**
     * Returns the current date in mm/dd/yyyy format.
     * */
     getToDaysDateFormatted: function()
    {
        return new Date().toLocaleDateString("en-US", {timeZone: "America/New_York",month: '2-digit',day:'2-digit', year:'numeric'});
    },

    /**
     * @param {date} date Date object
     * Returns the date in mm/dd/yyyy format.
     * */
    formatDate: function(date)
    {
        return  date.toLocaleDateString("en-US", {month: '2-digit',day:'2-digit', year:'numeric'});
    },
    /**
     * Returns the current date object in EST.
     * */
    getToDaysDate: function()
    {
        return new Date(new Date().toLocaleString("en-US",{timeZone: "America/New_York"}));
    },
    /**
     * @param {string} time string format to convert.
     * **/
    convertTime: function(time)
    {
        return new Date(time).toLocaleTimeString("en-US", {timeZone: "America/New_York", hour:'2-digit', minute:'2-digit'});
    },
    /**
     * Pass in the
     * @param {string}timeOfGame time in string format.
     * @returns {number} difference of time between current time and string in seconds.
     */
    getTimeDifferenceInSeconds: function(timeOfGame)
    {
        return (new Date(timeOfGame).getTime() - new Date().getTime()) / 1000;
    },
    /**
     * causes a wait.. use carefully.
     * @param milliseconds
     */
     sleep:function(seconds) {
        let date = new Date();
        let newDate = new Date(new Date().setSeconds(date.getSeconds() + seconds));

        while(date.getTime() < newDate.getTime()) {
            date = new Date();
            console.log(date);
            console.log(newDate);

        }
         return true;
    }
};