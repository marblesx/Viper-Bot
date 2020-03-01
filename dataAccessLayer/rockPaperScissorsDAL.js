let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

module.exports = {
    createDataBase: function () {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            console.log("Database created!");
            db.close();
        });
    },
    createDbCollection: function(){
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            let dbo = db.db("rps");
            dbo.createCollection("players", function(err, res) {
                if (err) throw err;
                console.log("Collection created!");
                db.close();
            });
        });
    },
    insertPlayer: async function(playerObj)
    {
        const db =  await MongoClient.connect(url);
        const dbo = db.db("rps");

        const result = await dbo.collection("players").insertOne(playerObj);
        return result;
    },
    findPlayer: async function(playerObj)
    {
       const db =  await MongoClient.connect(url);
        const dbo = db.db("rps");
        const query = { userGuid: playerObj.userGuid };
            const result = await dbo.collection("players").find(query).toArray();
            return result;
    },
    updatePlayer: async function(playerObj) {
        const db = await MongoClient.connect(url);
        const dbo = db.db("rps");
        const myquery = {userGuid: playerObj.userGuid};
        const newvalues = {$set: playerObj};
        const result = await dbo.collection("players").updateOne(myquery, newvalues);
        return result;
    }
};
