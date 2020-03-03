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
    },

    buildCytoStructure: function(concepts, connections) {
        //TODO return something like this:
        /*
        elements: [
            { group:'nodes', data:{ id: 'n0'}},
            { group:'nodes', data:{ id: 'n1'}},
            { group:'edges', data:{ id: 'e0', source: 'n0', target: 'n1'} },
            { group:'edges', data:{ id: 'e1', source: 'n1', target: 'n2'} },        
        */
        let elements = [];
        for(var c in concepts) {
            console.log("CONCEPTS");
            console.log(concepts);
            elements.push({ group:'nodes', data:{ id: concepts[c].id }  });
        }
        for(var n in connections) {
            console.log("CONNECTIONS");
            console.log(connections[n]);
            elements.push({ group:'edges', data:{ id: connections[n].id, source: connections[n].inV, target: connections[n].outV }  });
        }

        return elements;
    }
};