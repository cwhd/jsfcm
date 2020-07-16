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
        try {

            let inputs = req.body; 
            //console.log(inputs);
            let cDate = "";
            if(Object.prototype.toString.call(inputs.createDate === '[object Date]')) {
                context.log('Changing date...');
                cDate = inputs.createDate.toISOString();
            } else {
                context.log('Date already a string...');
                cDate = inputs.createDate;
            }
            //console.log(Object.prototype.toString.call(inputs.createDate));
            //console.log(Object.prototype.toString.call(cDate));
            //Object.prototype.toString.call(date) === '[object Date]'
            let concepts = [];
            let connections = [];

            client.open().then(() =>{
                context.log('Cosmos time...');
                client.submit("g.V().has('modelName', name).has('createDate', createDate).bothE().otherV().path()", { name: inputs.modelName, createDate: cDate }).then(function (result) {
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
        } catch (e) { 
            context.log('Err!');
            context.log(e);
            context.res = {
                status: 400,
                body: e
            };
        }
    }
};