// virtual dom
/* global Utils : false */

const createViewMerger = (viewMergerProto) => {
    if (typeof viewMergerProto.merge !== 'function' ||
        typeof viewMergerProto.create !== 'function') {
        throw new Error('View merger has to implement create and merge functions');
    }

    return Object.create(viewMergerProto);
};

const TextViewMerger = createViewMerger({
    createNeeded(element, view) {
        return (element.nodeType !== Node.TEXT_NODE || element.wholeText !== view.text);
    },
    create(view) {
        return document.createTextNode(view.text);
    },

    merge(element) {
        return element;
    },
    mergeNeeded(element, view) {
        return false;
    }
});

const ElementViewMerger = createViewMerger({
    createNeeded(element, view) {
        return (element.nodeType !== Node.ELEMENT_NODE || element.nodeName.toLowerCase() !== view.name.toLowerCase());
    },
    create(view) {
        let node = document.createElement(view.name);
        node.$$view = {};
        return node;
    },

    mergeNeeded(element, view) {
        return (element.$$view !== view);
    },
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

        mergeProps(element, view);
        mergeListeners(element, view);
        if (view.focused) {
            element.focus();
        }

        element.$$view = view;
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
            let elementChildrenCnt = element.childNodes.length,
                viewBodyItemCnt = view.body.length;

            if (elementChildrenCnt > viewBodyItemCnt) {
                let toRemove = [];
                for (let i = viewBodyItemCnt; i < elementChildrenCnt; i++) {
                    toRemove.push(element.childNodes.item(i));
                }
                toRemove.forEach((node) => {
                    if (node.$$view && !node.$$view.detached) {
                        node.$$view.detached = true;
                        node.parentNode.removeChild(node);
                    }
                });
                elementChildrenCnt = viewBodyItemCnt;
            }

            for (let i = 0; i < elementChildrenCnt; i++) {
                mergeWithDOM(element.childNodes.item(i), view.body[i]);
            }
            for (let i = elementChildrenCnt; i < viewBodyItemCnt; i++) {
                element.appendChild(mergeWithDOM(null, view.body[i]));
            }
        }

        function mergeWithDOM(element, view) {
            // create new element if old doesn't match
            if (mergers[view.type]) {
                let merger = mergers[view.type];

                if (element === null || merger.createNeeded(element, view)) {
                    let newElement = merger.create(view);
                    if (element !== null) {
                        element.parentElement.replaceChild(newElement, element);
                    }
                    element = newElement;
                }

                if (merger.mergeNeeded(element, view)) {
                    merger.merge(element, view);

                    if (view.body) {
                        mergeBody(element, view);
                    }
                }

                return element;
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
