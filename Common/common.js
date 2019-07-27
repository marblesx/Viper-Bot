
module.exports = {

    /**
     * Returns the current date in mm/dd/yyyy format.
     * */
     getToDaysDate: function()
    {
        return new Date().toLocaleDateString("en-US", {timeZone: "America/New_York",month: '2-digit',day:'2-digit', year:'numeric'});
    },
    /**
     * @param {string} time string format to convert.
     * **/
    convertTime: function(time)
    {
        return new Date(time).toLocaleTimeString("en-US", {timeZone: "America/New_York", hour:'2-digit', minute:'2-digit'});
    }
};