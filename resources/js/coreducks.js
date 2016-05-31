// virtual dom

function mount(originId, f, props = {}) {
    let origin = document.getElementById(originId);

    function clearOrigin() {
        while (origin.firstChild) {
            origin.removeChild(origin.firstChild);
        }
    }

    origin.appendChild(f(props));
    return () => {
        clearOrigin();
        origin.appendChild(f(props));
    };
}

function fragment(...fs) {
    return (props) => {
        console.log(`create fragment with ${fs}`);
        let frag = document.createDocumentFragment();
        fs.forEach((f) => frag.appendChild(f(props)));
        return frag;
    };
}

function el(name, attrs = {}, ...fs) {
    return (props) => {
        console.log(`create element <${name}> with attrs ${attrs}`);
        var element = document.createElement(name);
        Object.keys(attrs).forEach((attrName) => element.setAttribute(attrName, attrs[attrName]));
        fs.forEach((f) => element.appendChild(f(props)));
        return element;
    };
}

function text(s) {
    return (props) => {
        console.log(`create text node with text ${s}`);
        return document.createTextNode(s);
    };
}

// stores

function createStore(initialData) {
    let ev = document.createDocumentFragment();
    ev.data = initialData || {};

    ev.handle = (eventType, handler) => {
        ev.addEventListener(eventType, (e) => {
            e.target.data = handler(e.target.data, ...e.args);
            ev.dispatchEvent(new Event('$$updated'));
        });
    };

    ev.subscribe = (handler) => {
        ev.addEventListener('$$updated', (e) => {
            handler(e.target.data);
        });
    };

    ev.dispatch = (eventType, ...args) => {
        let event = new Event(eventType);
        event.args = args;
        ev.dispatchEvent(event);
    };
    return ev;
}
