let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";
const database = "splitgatedb";
const collections = "splitGateUsers"

module.exports = {
    /**
     * Returns a blank object to set up for a new user.
     * @return {Promise<{userGamerTag: string, userNickName: string, userGuid: string, userSys: string}>}
     */
    getSplitGateObj: async function(){
        return {
            userGuid: "",
            userSys:"",
            userGamerTag: "",
            userNickName: ""
        };
    },
    isUserRegistered: async function(userGuid){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userGuid: userGuid };
        const result = await dbo.collection(collections).find(query).toArray();
        return result.length !== 0;
    },
    isNickNameAvailable: async function(nickName){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userNickName: nickName };
        const result = await dbo.collection(collections).find(query).toArray();
        return result.length === 0;
    },
    updateRegisteredUser: async function(playerObj) {
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userGuid: playerObj.userGuid };
        const newvalues = {$set: playerObj};
        return dbo.collection(collections).updateOne(query, newvalues);
    },
    getUserByNickname: async function(nickName){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userNickName: nickName };
        return dbo.collection(collections).find(query).toArray();
    },
    findRegisteredUser: async function(userGuid){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userGuid: userGuid };
        return dbo.collection(collections).find(query).toArray();

    },
    registerUser: async function(playerObj){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);

       return  dbo.collection(collections).insertOne(playerObj);

    },
    deregisterUser: async function(playerObj){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);

        return   dbo.collection(collections).deleteOne(playerObj);

    },
    getAllUsers: async function(){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        return  dbo.collection(collections).find().toArray();

    },
}
