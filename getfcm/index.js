const structureBuilder = require('../SharedCode/structureBuilder');
const client = require("../SharedCode/db/gremlin-api-db")

module.exports = function (context, req) {

    context.log('Getting FCM');
    //console.log(process.env["cosmosEndpoint"]);

    if (!req.body) {
        context.res = {
            status: 400,
            body: "You must post inputs to this service"
        };
    } else {
        let inputs = req.body; 

        let concepts = [];
        let connections = [];

        client.open().then(() =>{
            client.submit("g.V().has('modelName', name).bothE().otherV().path()", { name: inputs.modelName }).then(function (result) {
                //console.log("Result: %s\n", JSON.stringify(result._items)); 

                concepts = structureBuilder.buildConcepts(result._items, inputs);
                connections = structureBuilder.buildConnections(result._items, concepts);

                let cytoStructure = structureBuilder.buildCytoStructure(concepts, connections);
            
                context.res = {
                    headers: {
                        'content-type':'application/json'
                    },
                    status: 200,
                    body: { elements: cytoStructure }
                };
                context.done();
            });
        });
    }
};