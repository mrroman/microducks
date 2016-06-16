// virtual dom

function mount(originId, f, props = {}) {
    let origin = document.getElementById(originId);

    function createNode(view) {
        let element;

        switch(view.type) {
        case 'tag':
            element = document.createElement(view.name);
            break;
        case 'text':
            element = document.createTextNode(view.text);
        }

        addMetadata(element);
        return element;
    }

    function addMetadata(element) {
        if (!element.$$coreducks) {
            element.$$coreducks = {
                listeners: {},
                attrs: {}
            };
        }
    }

    function merge(elementPart, viewPart, addFunc, removeFunc) {
        let names = Object.keys(viewPart),
            toRemove = names.filter((name) => {
                return (name in elementPart) && elementPart[name] !== viewPart[name];
            }),
            toAdd = names.filter((name) => {
                return !(name in elementPart) || elementPart[name] !== viewPart[name];
            });

        if (toAdd.length === 0 && toRemove.length === 0) {
            return;
        }

        toRemove.forEach((name) => {
            removeFunc(name, elementPart[name]);
            delete elementPart[name];
        });
        toAdd.forEach((name) => {
            addFunc(name, viewPart[name]);
            elementPart[name] = viewPart[name];
        });
    }

    function mergeAttributes(element, view) {
        merge(element.$$coreducks.attrs, view.attrs,
              Element.prototype.setAttribute.bind(element), Element.prototype.removeAttribute.bind(element));
    }

    function mergeListeners(element, view) {
        merge(element.$$coreducks.listeners, view.listeners,
              Element.prototype.addEventListener.bind(element), Element.prototype.removeEventListener.bind(element));
    }

    function mergeBody(element, view) {
        if (element.childNodes.length < view.body.length) {
            for (let i = element.childNodes.length; i < view.body.length; i++) {
                element.appendChild(createNode(view.body[i]));
            }
        } else if (element.childNodes.length > view.body.length) {
            let toRemove = [];
            for (let i = view.body.length; i < element.childNodes.length; i++) {
                toRemove.push(element.childNodes.item(i));
            }
            toRemove.forEach((node) => element.removeChild(node));
        }

        for (var i = 0; i < view.body.length; i++) {
            mergeWithDOM(element.childNodes.item(i), view.body[i]);
        }
    }

    function mergeWithDOM(element, view) {
        // create new element if old doesn't match
        function mergeTag() {
            if (element.nodeType !== Node.ELEMENT_NODE || element.nodeName.toLowerCase() !== view.name.toLowerCase()) {
                let newElement = createNode(view);
                element.parentNode.replaceChild(newElement, element);
                element = newElement;
            }

            mergeAttributes(element, view);
            mergeListeners(element, view);
            mergeBody(element, view);
            return element;
        }

        function mergeText() {
            if (element.nodeType !== Node.TEXT_NODE || element.wholeText !== view.text) {
                let newElement = createNode(view);
                element.parentNode.replaceChild(newElement, element);
                element = newElement;
            }
            return element;
        }

        switch(view.type) {
        case 'tag':
            return mergeTag();
        case 'text':
            return mergeText();
        default:
            return element;
        }
    }

    addMetadata(origin);
    origin = mergeWithDOM(origin, f(props));
    return () => {
        origin = mergeWithDOM(origin, f(props));
    };
}

function View(type) {
    this.type = type;
};

function El(name) {
    View.call(this, 'tag');
    this.name = name;
    this.attrs = {};
    this.listeners = {};
}

El.prototype = {
    attr(name, value) {
        this.attrs[name] = value;
        return this;
    },
    on(event, listener) {
        this.listeners[event] = listener;
        return this;
    },
    body(...views) {
        this.body = views;
        return this;
    }
};

function Text(s) {
    View.call(this, 'text');
    this.text = s;
}

const el = (name) => new El(name);
const text = (s) => new Text(s);

// stores

function createStore(initialData) {
    const ev = document.createDocumentFragment();
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

// utils

function cache(f) {
    let lastArgs = null,
        lastResult = null;

    return (...args) => {
        if (!lastArgs || !args.every((v,i) => lastArgs[i] === v)) {
            lastArgs = args;
            lastResult = f.apply(this, args);
        }

        return lastResult;
    };
}

export {
    mount,
    el,
    text,
    createStore,
    cache
};
