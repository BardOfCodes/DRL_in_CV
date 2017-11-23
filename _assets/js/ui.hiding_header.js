var header = document.getElementsByClassName("header")[0];

// hide header on scrolldown (and pageload, if below threshold)
window.addEventListener("scroll", toggleHeader.bind(header));

var Scroll = { "threshold": 120,
               "end":       window.scrollY,
               "dir":       "up", // initial value for calculating Scroll.turn
               "flick":     { "ready": false }, // prevent undefined var error
               "last":      {} };

function toggleHeader(e) {
    var klass = "hidden";

    // update Scroll object
    Scroll.last.end = Scroll.end;
    Scroll.last.dir = Scroll.dir;
    Scroll.end      = window.scrollY;
    Scroll.delta    = Scroll.end - Scroll.last.end;
    Scroll.dir      = Math.sign(Scroll.delta) < 0 ? "up" : "dn";
    Scroll.turn     = Scroll.dir !== Scroll.last.dir;
    Scroll.travel   = Math.abs(Scroll.delta);

    if (Scroll.dir === "up") {
        // initialize / reset flick timer
        if (Scroll.turn || !Scroll.flick.ready) {
            Scroll.flick = { "origin":  Scroll.last.end,
                             "ready":   true,
                             "timeout": setTimeout(function() {
                                            Scroll.flick.ready = false;
                                        }, 180) };
            return;
        // at top of page or on fast scrollup, show
        } else if (Scroll.end < Scroll.threshold ||
                  (Scroll.travel > Scroll.threshold && Scroll.flick.ready)) {
            this.removeClass(klass);
        }
    // on turn or when crossing threshold, hide
    } else if (Scroll.end > Scroll.threshold) {
        this.addClass(klass);
    }
}

// edge case: resized window
window.addEventListener("resize", restoreHeader.bind(header));

function restoreHeader(e) {
    if (window.scrollY < Scroll.threshold) {
        this.removeClass("hidden");
    }
}
