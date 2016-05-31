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

let store = createStore({ counter: 0});
store.handle('raise-counter', (data) => {
    data.counter = data.counter > 255 ? data.counter : data.counter + 16;
    return data;
});

function mount(originId, f, props = {}) {
    let origin = document.getElementById(originId);

    function clearOrigin() {
        while (origin.firstChild) {
            origin.removeChild(origin.firstChild);
        }
    }

    origin.appendChild(f(props));
    return (props) => {
        clearOrigin();
        origin.appendChild(f(props));
    };
}

function fragment(...fs) {
    let frag = document.createDocumentFragment();
    fs.forEach((f) => frag.appendChild(f()));
    return frag;
}

function el(name, attrs = {}, ...fs) {
    return () => {
        var element = document.createElement(name);
        Object.keys(attrs).forEach((attrName) => element.setAttribute(attrName, attrs[attrName]));
        fs.forEach((f) => element.appendChild(f()));
        return element;
    };
}

function text(s) {
    return () => {
        return document.createTextNode(s);
    };
}

let counter = mount('main', (data) => {
    return fragment(el('div',
                       {style: "color: rgb("+ data.counter +",0,0);"},
                       text('' + data.counter)));
}, store.data);

store.subscribe((data) => {
    counter(data);
});
