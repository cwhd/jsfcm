//const cosmos = require('@azure/cosmos');
const { cosmosGremlinApi } = require('./config');
const Gremlin = require('gremlin');

const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/${cosmosGremlinApi.database}/colls/${cosmosGremlinApi.collection}`, cosmosGremlinApi.primaryKey)
//const authenticator = new Gremlin.driver.auth.PlainTextSaslAuthenticator(`/dbs/fcm/colls/cosell`, cosmosGremlinApi.primaryKey)

const client = new Gremlin.driver.Client(
    cosmosGremlinApi.endpoint, 
    { 
        authenticator,
        traversalsource : "g",
        rejectUnauthorized : true,
        mimeType : "application/vnd.gremlin-v2.0+json"
    }
);

module.exports = client;