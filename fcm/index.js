//you can use these for testing...
//const data = require('../TestData/query1.json');
//const inputs = require('../TestData/inputs1.json');
const structureBuilder = require('../SharedCode/structureBuilder');
const fcmBaseCalculator = require('../SharedCode/fcmBaseCalculator');
const squashingFunctions = require('../SharedCode/squashingFunctions');
const client = require("../SharedCode/db/gremlin-api-db")

module.exports = function (context, req) {

    context.log('Gaussian FCM triggered');

    if (!req.body) {
        context.res = {
            status: 400,
            body: "You must post inputs to this service"
        };
    } else {
        console.log(process.env["cosmosEndpoint"]);
        /*
        endpoint: process.env["cosmosEndpoint"],
        primaryKey: process.env["primaryKey"],
        database: process.env["fcm"],
        collection: process.env["cosell"]        
        */
        let inputs = req.body;

        let concepts = [];
        let connections = [];

        let results = [];
        let epochs = inputs.epochs;

        client.open().then(() =>{
            client.submit("g.V().has('modelName', name).bothE().otherV().path()", { name: inputs.modelName }).then(function (result) {
                console.log("Result: %s\n", JSON.stringify(result._items));

                concepts = structureBuilder.buildConcepts(result._items, inputs);
                connections = structureBuilder.buildConnections(result._items, concepts);
            
                for(var e = 0; e < epochs; e++) {
                    concepts = fcmBaseCalculator.initialValueCalculation(concepts);
                    
                    switch(inputs.act.toLowerCase()) {
                        case "gaussian":
                            concepts = squashingFunctions.gaussian(concepts);
                    }
            
                    for (var c in concepts) {
                        concepts[c].previousValue = concepts[c].value;
                        concepts[c].value = concepts[c].nextValue;
                        concepts[c].nextValue = 0;
                        results.push({
                            "node": concepts[c].id,
                            "value": concepts[c].value,
                            "iteration" : e
                        });
                    }
                }
            
                context.res = {
                    headers: {
                        'content-type':'application/json'
                    },
                    status: 200,
                    body: { results: results }
                };
                context.done();
            });
        });
    }
};