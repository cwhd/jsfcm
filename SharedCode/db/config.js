module.exports = {
    cosmosGremlinApi: {
      endpoint: process.env["cosmosEndpoint"],
      primaryKey: process.env["primaryKey"],
      database: process.env["database"],
      collection: process.env["collection"]
    }
  };
  
  