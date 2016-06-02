// virtual dom

function mount(originId, f, props = {}) {
    let origin = document.getElementById(originId);

    function mergeAttributes(element, view) {
        let attrsToRemove = [];
        for (let i = 0; i < element.attributes.length; i++) {
            let nodeName = element.attributes[i].nodeName;
            if (!(nodeName in view.attrs)) {
                attrsToRemove.push(nodeName);
            }
        }
        attrsToRemove.forEach((attr) => element.attributes.removeNamedItem(attr));
        view.attrs && Object.keys(view.attrs).forEach((attr) => {
            element.setAttribute(attr, view.attrs[attr]);
        });
    }

    function createNode(view) {
        return (view.type === 'tag' ? document.createElement(view.name) : document.createTextNode(view.text));
    }

    function mergeWithDOM(element, view) {
        // create new element if old doesn't match
        if (view.type === 'tag') {
            if (element.nodeType !== Node.ELEMENT_NODE || element.nodeName.toLowerCase() !== view.name.toLowerCase()) {
                let newElement = createNode(view);
                console.log('new element', view, element.nodeName, element.wholeText);
                element.parentNode.replaceChild(newElement, element);
                element = newElement;
            }
        }

        if (view.type === 'text') {
            if (element.nodeType !== Node.TEXT_NODE || element.wholeText !== view.text) {
                let newElement = createNode(view);
                element.parentNode.replaceChild(newElement, element);
                element = newElement;
            }
            return element;
        } else {
            mergeAttributes(element, view);
            if (element.childNodes.length < view.nodes.length) {
                for (let i = element.childNodes.length; i < view.nodes.length; i++) {
                    element.appendChild(createNode(view.nodes[i]));
                }
            } else if (element.childNodes.length > view.nodes.length) {
                let toRemove = [];
                for (let i = view.nodes.length; i < element.childNodes.length; i++) {
                    toRemove.push(element.childNodes.item(i));
                }
                toRemove.forEach((node) => element.removeChild(node));
            }

            for (var i = 0; i < view.nodes.length; i++) {
                mergeWithDOM(element.childNodes.item(i), view.nodes[i]);
            }
        }

        return element;
    }

    origin = mergeWithDOM(origin, f(props));
    return () => {
        origin = mergeWithDOM(origin, f(props));
    };
}

function el(name, attrs = {}, ...es) {
    return {
        type: 'tag',
        name: name,
        attrs: attrs,
        nodes: es
    };
}

function text(s) {
    return {
        type:'text',
        text: s
    };
}

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
