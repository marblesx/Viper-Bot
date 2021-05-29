let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

const rps = "rps";
const players = "players";
module.exports = {
    createDataBase: function () {
        MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true}, function (err, db) {
            if (err) throw err;
            console.log("Database created!");
            db.close();
        });
    },
    createDbCollection: function(){
        MongoClient.connect(url , {useNewUrlParser:true, useUnifiedTopology:true},function(err, db) {
            if (err) throw err;
            let dbo = db.db(rps);
            dbo.createCollection(players, function(err, res) {
                if (err) throw err;
                console.log("Collection created!");
                db.close();
            });
        });
    },
    insertPlayer: async function(playerObj)
    {
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(rps);

        return await dbo.collection(players).insertOne(playerObj);
    },
    findPlayer: async function(playerObj)
    {
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(rps);
        const query = { userGuid: playerObj.userGuid };
        return await dbo.collection(players).find(query).toArray();
    },
    updatePlayer: async function(playerObj) {
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(rps);
        const myquery = {userGuid: playerObj.userGuid};
        const newvalues = {$set: playerObj};
        return await dbo.collection(players).updateOne(myquery, newvalues);
    }
};
