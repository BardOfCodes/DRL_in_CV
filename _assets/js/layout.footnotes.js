// Move footnotes to end

window.addEventListener('load', moveFootnotes);

function moveFootnotes(e) {
    if (document.getElementsByClassName('footnotes').length > 0) {
        var Footnotes = {};
        Footnotes.div = document.getElementsByClassName('footnotes')[0];
        Footnotes.container = document.createElement('div');
        Footnotes.container.addClass('backdrop-footnotes');
        Footnotes.container.appendChild(Footnotes.div);

        Footnotes.sibling = document.getElementsByTagName('hr');
        Footnotes.sibling = Footnotes.sibling[Footnotes.sibling.length - 1];
        Footnotes.parent  = Footnotes.sibling.parentNode;
        Footnotes.parent.insertBefore(Footnotes.container, Footnotes.sibling);

        Footnotes.heading = document.createElement('h2');
        Footnotes.heading.innerHTML = "Notes";
        Footnotes.div.insertBefore(Footnotes.heading, Footnotes.div.firstChild);
    }
}
