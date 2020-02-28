module.exports = {

    /**
     * 
     * @param {*} concepts 
     * Calculate new value for each node before the squashing function 
     * for each concept
     * - get the value of each incoming node
     * -- multiple the value by the connection weight
     * - sum all incoming weighted values
     */
    initialValueCalculation: function(concepts) {
        for (var c in concepts) {
            concepts[c].nextValue = 0;
            for(var cc in concepts[c].connections) {
                var fromConnection = concepts[c].connections[cc];
                var fromConcept = concepts.find(f => f.id = fromConnection.inV);
                concepts[c].nextValue += fromConcept.value * fromConnection.properties.weight;
            }
        }
        return concepts;
    },
};