function View(type) {
    this.type = type;
}

function El(name) {
    View.call(this, 'tag');
    this.name = name;
    this.props = {};
    this.listeners = {};
    this.body = [];
}

El.prototype = {
    prop(name, value) {
        if (this.props[name]) {
            console.warn(`Property ${name} has been duplicated.`);
        }
        this.props[name] = value;
        return this;
    },
    propIf(condition, name, value) {
        if (condition) {
            this.prop(name, value);
        }
        return this;
    },
    on(event, listener) {
        if (this.listeners[event]) {
            console.warn(`Listener on event ${event} has been duplicated.`);
        }
        this.listeners[event] = listener;
        return this;
    },
    node() {
        const element = document.createElement(this.name);
        element.$$view = {};
        return element;
    },
    focus() {
        this.focused = true;
        return this;
    },
    has(...views) {
        Array.prototype.push.apply(this.body, views);
        return this;
    },
    hasIf(condition, ...views) {
        if (condition) {
            this.has(...views);
        }
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

const el = (name, txt) => {
    if (typeof txt === 'string') {
        return new El(name).has(new Text(txt));
    } else {
        return new El(name);
    }
};
const text = (s) => new Text(s);
