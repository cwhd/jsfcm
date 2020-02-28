module.exports = {

    /**
     * 
     * Gaussian squashing function
     * Math.exp(-1.0 * Math.pow((input), 2.0) / 2.0 * 1.0);
     */
    gaussian: function(concepts) {
        for (var c in concepts) {
            var valInput = concepts[c].nextValue + concepts[c].previousValue;
            concepts[c].nextValue = Math.exp(-1.0 * Math.pow((valInput), 2.0) / 2.0 * 1.0);
        }
        return concepts;
    }

}