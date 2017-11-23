var navList   = document.getElementsByClassName("nav__list")[0],
    navButton = document.getElementsByClassName("nav__toggle")[0];

// click to toggle nav menu
navButton.addEventListener("click", toggleNav.bind(navList));
window.addEventListener("click", closeNav.bind(navList));

var Toggle = {};

function toggleNav(e) {
    var klass = "collapsed";
    this.toggleClass(klass);
    Toggle.recent = true;
    setTimeout(function() { Toggle.recent = false; }, 25);
}

function closeNav(e) {
    var klass     = "collapsed",
        footprint = this.getBoundingClientRect(),
        pointer   = { "belowFloor": e.clientY - footprint.bottom > 0,
                      "wideOfLeft": e.clientX - footprint.left < 0 },
        screen    = { "mobile": window.innerWidth < 600,
                      "tablet": window.innerWidth >= 600 && window.innerWidth < 900 };

    if (!this.hasClass(klass) && !Toggle.recent) {
        if ((screen.mobile && pointer.belowFloor) || 
            (screen.tablet && pointer.wideOfLeft)) {
                e.preventDefault();
                this.addClass(klass);
        }
    }
}

// swipe to hide nav menu
window.addEventListener('touchstart', swipeNavStart.bind(navList));
window.addEventListener('touchmove', swipeNavMvmt.bind(navList), { passive:  false });
window.addEventListener('touchend', swipeNavEnd.bind(navList));

var Swipe = { 'threshold': 30,
              'travel': {} };

function swipeNavStart(e) {
    // initialize Swipe object
    if (!this.hasClass("collapsed")) {
        Swipe.ready     = true;
        Swipe.start     = { "x": e.changedTouches[0].clientX,
                            "y": e.changedTouches[0].clientY };
        Swipe.timeout   = setTimeout(flickExpire.bind(this), 250);
    }

    function flickExpire() {
        if (!Swipe.ready) { return; }
        Swipe.ready = false;
    }
}

function swipeNavMvmt(e) {
    // bail out if swipe event has been reset
    if (!Swipe.ready) { return; }

    // prevent touch-scroll
    e.preventDefault();

    // update Swipe object
    Swipe.travel.x = e.changedTouches[0].clientX - Swipe.start.x;
    Swipe.travel.y = e.changedTouches[0].clientY - Swipe.start.y;
}

function swipeNavEnd(e) {
    // bail out if swipe event has been reset
    if (!Swipe.ready) { return; }

    // reset Swipe object
    Swipe.ready = false;

    if ((window.innerWidth < 600 && Swipe.travel.y < 0) ||
        (window.innerWidth > 599 && window.innerWidth < 900 && Swipe.travel.x > 0)) {
        this.addClass("collapsed");
    }
}

// scroll to hide nav menu
window.addEventListener("scroll", scrollOff.bind(navList));

function scrollOff(e) {
    if (window.innerWidth < 900 && !this.hasClass("collapsed")) {
        this.addClass("collapsed");
    }
}
