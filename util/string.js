String.prototype.camelize = function() {
    return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, idx) {
        return idx === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}

String.prototype.capitalize = function() {
    return this.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, idx) {
        return word.toUpperCase();
    }).replace(/\s+/g, '');
}
