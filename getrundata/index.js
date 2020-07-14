const client = require("../SharedCode/db/sql-api-db");

module.exports = function (context, req) {

    context.log('Getting data...');
    //console.log(process.env["cosmosEndpoint"]);

    if (!req.body) {
        context.res = {
            status: 400,
            body: "You must post inputs to this service"
        };
    } else {
        let inputs = req.body; 

        client.open().then(() =>{
            client.submit("g.V().has('modelName', name).bothE().otherV().path()", { name: inputs.modelName }).then(function (result) {
                //console.log("Result: %s\n", JSON.stringify(result._items)); 

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