const cosmos = require('@azure/cosmos');
const { cosmosSqlApi } = require('./config');
const { CosmosClient } = cosmos;
const client = new CosmosClient({ endpoint: cosmosSqlApi.endpoint, key: cosmosSqlApi.primaryKey });

module.exports = client;