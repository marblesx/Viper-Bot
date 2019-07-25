
module.exports = {

    /**
     * Returns the current date in mm/dd/yyyy format.
     * */
     getToDaysDate: function()
    {
        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1; //January is 0!

        let yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return mm + '/' + dd + '/' + yyyy;
    },
    /**
     * @param {string} time string format to convert.
     * **/
    convertTime: function(time)
    {
        return new Date(time).toLocaleTimeString("en-US", {timeZone: "America/New_York", hour:'2-digit', minute:'2-digit'});
    }
};