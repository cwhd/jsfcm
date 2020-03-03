module.exports = {
    cosmosGremlinApi: {
      endpoint: process.env["cosmosEndpoint"],
      primaryKey: process.env["primaryKey"],
      database: process.env["fcm"],
      collection: process.env["cosell"]
    },
  };
  
  