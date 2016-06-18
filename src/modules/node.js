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

function View(type) {
    this.type = type;
}

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
