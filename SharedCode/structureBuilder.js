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
                    var parentVector = concepts.find(obj => obj.id == currentObject.outV);
                    var alreadyThere = parentVector.connections.find(obj => obj.id == currentObject.id);
                    if(!alreadyThere) {
                        //console.log(currentObject);
                        parentVector.connections.push(currentObject);
                    }    
                }
            }
        }
        return connections;
    },

    buildCytoStructure: function(concepts, connections) {
        //console.log("CONCEPTS:");
        //console.log(concepts);
        //console.log("CONNECTIONS:");
        //console.log(connections);
        let nodes = [];
        let edges = [];
        for(var c in concepts) {
            console.log("CNCEP");
            console.log(concepts[c]);
            let thisNode = { data:{ id: concepts[c].id, name: concepts[c].label }};
            //console.log(concepts[c].properties);
            if(concepts[c].properties.x && concepts[c].properties.y) {
                //console.log(concepts[c].properties.x);
                thisNode.data.x = concepts[c].properties.x[0].value;
                thisNode.data.y = concepts[c].properties.y[0].value;
            }
            if(concepts[c].properties.createDate) {
                //console.log(concepts[c].properties.x);
                thisNode.data.createDate = concepts[c].properties.createDate[0].value;
            }
            nodes.push(thisNode);
        }
        console.log("CONNEC...");
        //console.log(connections);
        for(var n in connections) {
            //console.log("CONNEC...");
            //console.log(n);
            //console.log(connections[n]);
            //let thisEdge = { data:{ id: connections[n].id, source: connections[n].inV, target: connections[n].outV, label: connections[n].label } };
            let thisEdge = { data:{ id: connections[n].id, source: connections[n].outV, target: connections[n].inV } };
            if(connections[n].label) {
                thisEdge.data["label"] = connections[n].label;
            }
            let props = Object.keys(connections[n].properties);
            for(var p in props) {
                thisEdge.data[props[p]] = connections[n].properties[props[p]];
            }

            console.log("PUSHING");
            edges.push(thisEdge);
        }
        console.log("DONE WITH CONNECTIONS...");
        //console.log(nodes);
        //console.log(edges);
        return { nodes: nodes, edges: edges };
    }
};