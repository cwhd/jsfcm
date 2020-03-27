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
                    if(inputs.values) {
                        var inputValue = inputs.values.find(inp => inp.node == currentObject.id);
                        currentObject.value = inputValue.value;
                    }
                    currentObject.connections = [];
                    currentObject.previousValue = 0;
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
        /*
        elements: [
            { group:'nodes', data:{ id: 'n0'}},
            { group:'nodes', data:{ id: 'n1'}},
            { group:'edges', data:{ id: 'e0', source: 'n0', target: 'n1'} },
            { group:'edges', data:{ id: 'e1', source: 'n1', target: 'n2'} },        
        */
        //let elements = [];
        let nodes = [];
        let edges = [];
        for(var c in concepts) {
            console.log("CNCEP");
            //console.log(concepts[c]);
            let thisNode = { data:{ id: concepts[c].id, name: concepts[c].id }};
            console.log(concepts[c].properties);
            if(concepts[c].properties.x && concepts[c].properties.y) {
                console.log(concepts[c].properties.x);
                thisNode.data.x = concepts[c].properties.x[0].value;
                thisNode.data.y = concepts[c].properties.y[0].value;
            }
            nodes.push(thisNode);
        }
        for(var n in connections) {
            let thisEdge = { data:{ id: connections[n].id, source: connections[n].inV, target: connections[n].outV, label: connections[n].label } };
            let props = Object.keys(connections[n].properties);
            for(var p in props) {
                thisEdge.data[props[p]] = connections[n].properties[props[p]];
            }

            edges.push(thisEdge);
        }

        return { nodes: nodes, edges: edges };
    }
};