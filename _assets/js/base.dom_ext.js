var RegExps = {};
function cacheRegExp(klass){
    return RegExps[klass] || (RegExps[klass] = new RegExp("(?:^|\\s)" + klass + "(?:$|\\s)", "gi"))
}

Element.prototype.toggleClass = function(klass) {
    if ( this.hasClass(klass) ) {
        this.removeClass(klass);
    } else {
        this.addClass(klass);
    }
};

Element.prototype.addClass = function(klass) {
    if ( !this.hasClass(klass) ) {
        this.className += " " + klass;
    }
};

Element.prototype.removeClass = function(klass) {
    if ( this.hasClass(klass) ) {
        this.className = this.className.replace(cacheRegExp(klass), ' ');
    }
};

Element.prototype.hasClass = function(klass) {
    return this.className.match(cacheRegExp(klass))
};
