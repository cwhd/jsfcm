const structureBuilder = require('../SharedCode/structureBuilder');
const client = require("../SharedCode/db/gremlin-api-db")

module.exports = function (context, req) {

    context.log('Querying Gremlin');

    if (!req.body) {
        context.res = {
            status: 400,
            body: "You must post inputs to this service"
        };
    } else {
        let input = req.body; 

        client.open().then(() =>{
            client.submit(input.query, { }).then(function (result) {
                console.log("Result: %s\n", JSON.stringify(result)); 

                context.res = {
                    headers: {
                        'content-type':'application/json'
                    },
                    status: 200,
                    body: result
                };
                context.done();
            });
        });
    }
};