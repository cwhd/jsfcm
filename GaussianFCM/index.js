const data = require('../TestData/query1.json');
const inputs = require('../TestData/inputs1.json');
const structureBuilder = require('../SharedCode/structureBuilder');
const fcmBaseCalculator = require('../SharedCode/fcmBaseCalculator');
const squashingFunctions = require('../SharedCode/squashingFunctions');

module.exports = function (context, req) {

    context.log('Gaussian FCM triggered');
    //TODO first get the data from CosmosDB

    /*
    if (req.query.name || (req.body && req.body.name)) {
        context.res = {
            // status: 200, 
            body: "Hello " + (req.query.name || req.body.name)
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a name on the query string or in the request body"
        };
    }
    */

    let concepts = [];
    let connections = [];

    concepts = structureBuilder.buildConcepts(data, inputs);
    connections = structureBuilder.buildConnections(data, concepts);

    let results = [];
    let epochs = inputs.epochs;

    for(var e = 0; e < epochs; e++) {
        //console.log("Epoch #" + e);

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
};