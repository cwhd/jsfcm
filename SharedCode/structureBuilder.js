module.exports = {

    /**
     * Build out the concepts as objects from the result of the Gremlin Query
     * @param {*} data JSON returned from gremlin/CosmosDB
     * @param {*} inputs inputs from the HTTP call
     */
    buildConcepts: function(data, inputs) {
        let concepts = [];

        for (var i in data) { //each set of vectors...
            for(var j in data[i].objects) { //group of related vectors and edges
                var currentObject = data[i].objects[j];
                var alreadyThere = concepts.find(obj => obj.id == currentObject.id);
                if (currentObject.type == "vertex" && !alreadyThere) {
                    var inputValue = inputs.values.find(inp => inp.node == currentObject.id);
                    currentObject.connections = [];
                    currentObject.previousValue = 0;
                    currentObject.value = inputValue.value;
                    currentObject.nextValue = 0;
                    concepts.push(currentObject);
                } 
            }
        }
        return concepts;
    },
    
    /**
     * Create the connections as objects
     * @param {*} data results from gremlin/CosmosDB query
     * @param {*} concepts concepts for this model
     */
    buildConnections: function(data, concepts) {
        let connections = [];

        for (var i in data) { 
            for(var j in data[i].objects) { //group of related vectors and edges
                var currentObject = data[i].objects[j];
                var isInConnectionArray = connections.find(obj => obj.id == currentObject.id);
                if (currentObject.type == "edge" && !isInConnectionArray) {
                    connections.push(currentObject);
                    var parentVector = concepts.find(obj => obj.id == currentObject.inV);
                    var alreadyThere = parentVector.connections.find(obj => obj.id == currentObject.id);
                    if(!alreadyThere) {
                        parentVector.connections.push(currentObject);
                    }    
                }
            }
        }
        return connections;
    }
};