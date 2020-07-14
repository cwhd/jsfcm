module.exports = {
  cosmosSqlApi: {
    endpoint: process.env["cosmosSqlEndpoint"],
    primaryKey: process.env["cosmosSqlKey"],
    database: {
      id: process.env["cosmosSqlDb"]
    },
    containers: {
      usersContainer: {
        id: process.env["cosmosSqlCollection"],
        partitionKey: { kind: 'Hash', paths: ['/user'] }
      }
    }
  },  
    cosmosGremlinApi: {
      endpoint: process.env["cosmosEndpoint"],
      primaryKey: process.env["primaryKey"],
      database: process.env["database"],
      collection: process.env["collection"]
    }
  };
  
  