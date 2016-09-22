// virtual dom
/* global Utils : false */

const createViewMerger = (viewMergerProto) => {
    if (typeof viewMergerProto.merge !== 'function' ||
        typeof viewMergerProto.createNode !== 'function') {
        throw new Error('View merger has to implement createNode and merge functions');
    }

    return Object.create(viewMergerProto);
};

const TextViewMerger = createViewMerger({
    merge(element, view) {
        if (element.nodeType !== Node.TEXT_NODE || element.wholeText !== view.text) {
            let newElement = this.createNode(view);
            element.parentNode.replaceChild(newElement, element);
            element = newElement;
        }

        element.$$view = view;
        return element;
    },
    createNode(view) {
        return document.createTextNode(view.text);
    }
});

const ElementViewMerger = createViewMerger({
    merge(element, view) {
        function mergeProps(element, view) {
            element.$$view.props = element.$$view.props || {};
            Utils.merge(element.$$view.props, view.props,
                        (name, next, prev) => element[name] = next,
                        (name, next, prev) => element[name] = null);
        }

        function mergeListeners(element, view) {
            element.$$view.listeners = element.$$view.listeners || {};
            Utils.merge(element.$$view.listeners, view.listeners,
                        (name, next, prev) => {
                            element.removeEventListener(name, prev);
                            element.addEventListener(name, next);
                        },
                        Element.prototype.removeEventListener.bind(element));
        }

        if (element.nodeType !== Node.ELEMENT_NODE || element.nodeName.toLowerCase() !== view.name.toLowerCase()) {
            let newElement = this.createNode(view);
            element.parentNode.replaceChild(newElement, element);
            element = newElement;
        }

        if (element.$$view !== view) {
            mergeProps(element, view);
            mergeListeners(element, view);
            if (view.focused) {
                element.focus();
            }

            element.$$view = view;
        }

        return element;
    },
    createNode(view) {
        let node = document.createElement(view.name);
        node.$$view = {};
        return node;
    }
});

const DefaultMergers = {
    'text': TextViewMerger,
    'element': ElementViewMerger
};

const VDOM = {
    createMerger(originId, mergers = DefaultMergers) {
        let origin = document.getElementById(originId);

        function mergeBody(element, view) {
            if (element.childNodes.length < view.body.length) {
                for (let i = element.childNodes.length; i < view.body.length; i++) {
                    element.appendChild(mergers[view.type].createNode(view.body[i]));
                }
            } else if (element.childNodes.length > view.body.length) {
                let toRemove = [];
                for (let i = view.body.length; i < element.childNodes.length; i++) {
                    toRemove.push(element.childNodes.item(i));
                }
                toRemove.forEach((node) => {
                    if (node.$$view && !node.$$view.detached) {
                        node.$$view.detached = true;
                        node.parentNode.removeChild(node);
                    }
                });
            }

            for (let i = 0; i < view.body.length; i++) {
                mergeWithDOM(element.childNodes.item(i), view.body[i]);
            }
        }

        function mergeWithDOM(element, view) {
            // create new element if old doesn't match
            if (DefaultMergers[view.type]) {
                let elementView = element.$$view,
                    mergedElement = DefaultMergers[view.type].merge(element, view);

                if (view.body && elementView !== view) {
                    mergeBody(mergedElement, view);
                }

                return mergedElement;
            } else {
                return element;
            }
        }

        origin.$$view = {};

        let fn = (view) => {
            origin = mergeWithDOM(origin, view);
            fn.origin = origin;
        };

        return fn;
    }
};
