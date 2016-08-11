function View(type) {
    this.type = type;
}

function El(name) {
    View.call(this, 'tag');
    this.name = name;
    this.props = {};
    this.listeners = {};
}

El.prototype = {
    prop(name, value) {
        this.props[name] = value;
        return this;
    },
    on(event, listener) {
        this.listeners[event] = listener;
        return this;
    },
    node() {
        const element = document.createElement(this.name);
        element.$$view = {};
        return element;
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

Text.prototype = {
    node() {
        let element = document.createTextNode(this.text);
        element.$$view = {};
        return element;
    }
};

const el = (name) => new El(name);
const text = (s) => new Text(s);
