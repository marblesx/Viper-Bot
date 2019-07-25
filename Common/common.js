
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
    convertTime: function(time)
    {
        let date = new Date(time);
        let offset = -300; //Timezone offset for EST in minutes.
        let estDate = new Date(date.getTime() + offset*60*1000);
       return estDate.toTimeString();
    }
};