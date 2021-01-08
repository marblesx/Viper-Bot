let MongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";
const database = "halodb";
const collections = "haloUsers"


module.exports = {
    /**
     * Returns a blank object to set up for a new user.
     * @return {Promise<{userGamerTag: string, userNickName: string, userGuid: string}>}
     */
    getHaloUserObj: async function(){
       const haloUserObj = {
            userGuid: "",
            userGamerTag: "",
            userNickName: ""
        };
       return haloUserObj;
    },
    isUserRegistered: async function(userGuid){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userGuid: userGuid };
        const result = await dbo.collection(collections).find(query).toArray();
        if(result.length === 0){
            return false;
        }else{
            return true;
        }
    },
    isNickNameAvailable: async function(nickName){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userNickName: nickName };
        const result = await dbo.collection(collections).find(query).toArray();
        if(result.length === 0){
            return true;
        }else{
            return false;
        }
    },
    updateRegisteredUser: async function(playerObj) {
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userGuid: playerObj.userGuid };
        const newvalues = {$set: playerObj};
        const result = await dbo.collection(collections).updateOne(query, newvalues);
        return result;
    },
    getUserByNickname: async function(nickName){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userNickName: nickName };
        const result = await dbo.collection(collections).find(query).toArray();
        return result;
    },
    findRegisteredUser: async function(userGuid){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);
        const query = { userGuid: userGuid };
        const result = await dbo.collection(collections).find(query).toArray();
        return result;
    },
    registerUser: async function(playerObj){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);

        const result = await dbo.collection(collections).insertOne(playerObj);
        return result;
    },
    deregisterUser: async function(playerObj){
        const db =  await MongoClient.connect(url,{useNewUrlParser:true, useUnifiedTopology:true});
        const dbo = db.db(database);

        const result = await dbo.collection(collections).deleteOne(playerObj);
        return result;
    }
}
