var Contact = {};

Contact.deobfuscateLink = function(element) {
    var absolutePath   = element.href,
        pathSegments   = absolutePath.split('/'),
        obfuscatedLink = pathSegments[pathSegments.length - 1],
        unreversedLink = obfuscatedLink.split('').reverse().join(''),
        deobfuscation  = decodeURIComponent(unreversedLink);
    return deobfuscation;
}

Contact.patchButtons = function(klass) {
    var elements = document.getElementsByClassName(klass);
    for (i = 0; i < elements.length; i++) {
        elements[i].href = Contact.deobfuscateLink(elements[i]);
    }
}

Contact.patchButtons('email');
