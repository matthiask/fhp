__ = {
    /* Thanks, http://dabblet.com/code/utopia.js */
    list: function(expr, con) {
        return Array.prototype.slice.call((con || document).querySelectorAll(expr));
    }
    , get: function(expr, con) {
        return typeof expr === 'string'? (con || document).querySelector(expr) : expr;
    }
    , each: function(obj, func, context) {
        context = context || obj;
        for (var i in obj) {
            if(obj.hasOwnProperty && obj.hasOwnProperty(i)) {
                var ret = func.call(context, obj[i], i);

                if(!!ret || ret === 0 || ret === '') {
                    return ret;
                }
            }
        }
        return null;
    }
};


window.addEventListener('load', function() {
    var slides = __.list('section'),
        current = 0;

    function mark() {
        if (current < 0) current = 0;
        if (current >= slides.length) current = slides.length - 1;

        __.list('section.current').forEach(function(element) {
            element.classList.remove('current');
        });
        slides[current].classList.add('current');
    }

    function parsehash() {
        if (window.location.hash) {
            current = parseInt(window.location.hash.substr(6));
            if (isNaN(current)) current = 0;
        }
    }

    document.body.addEventListener('keydown', function(event) {
        switch(event.keyCode) {
            case 39:
            case 32:
                current = Math.min(slides.length - 1, ++current);
                window.location.hash = 'slide' + current;
                return false;
            case 37:
                current = Math.max(0, --current);
                window.location.hash = 'slide' + current;
                return false;
        }
        console.log(event);
    });

    // initialization
    parsehash();
    mark();

    window.addEventListener('hashchange', function() {
        parsehash();
        mark();
    });

    __.list('li').forEach(function(element) {
        element.innerHTML = '<span class="marker"></span>' + element.innerHTML;
    });
    __.list('section.title').forEach(function(element, idx) {
        element.innerHTML = '<span class="marker"></span>' + element.innerHTML;
        element.classList.add('n' + idx);
    });
    __.list('section.image').forEach(function(element) {
        var img = __.get('img', element),
            css = {
                'backgroundImage': 'url(' + img.getAttribute('src') + ')'
                };

        if (img.width > window.innerWidth || img.height > window.innerHeight)
            css.backgroundSize = 'contain';

        __.each(css, function(value, key) {
            element.style[key] = value;
        });

        img.parentNode.removeChild(img);
    });
});
