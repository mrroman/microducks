/* global Utils : false */

class DOMUpdate {
    createNeeded(element, view) {
        return false;
    }

    create(view) {
        throw new Error('create not implemented');
    }

    mergerNeeded(element, view) {
        return false;
    }

    merge(element, view) {
        throw new Error('merge not implemented');
    }

    attached(element, view) {
    }
}

class TextViewDOMUpdate extends DOMUpdate {
    createNeeded(element, view) {
        return (element.nodeType !== Node.TEXT_NODE || element.wholeText !== view.text);
    }

    create(view) {
        return document.createTextNode(view.text);
    }

    merge(element) {
        return element;
    }

    mergeNeeded(element, view) {
        return false;
    }
}

class ElementViewDOMUpdate extends DOMUpdate {
    createNeeded(element, view) {
        return (element.nodeType !== Node.ELEMENT_NODE || element.nodeName.toLowerCase() !== view.name.toLowerCase());
    }

    create(view) {
        let node = document.createElement(view.name);
        node.$$view = {};
        return node;
    }

    mergeNeeded(element, view) {
        return (element.$$view !== view);
    }

    merge(element, view) {
        this.mergeProps(element, view);
        this.mergeListeners(element, view);
        if (view.focused) {
            element.focus();
        }

        element.$$view = view;
    }

    mergeProps(element, view) {
        element.$$view.props = element.$$view.props || {};
        Utils.merge(element.$$view.props, view.props,
                    (name, next, prev) => element[name] = next,
                    (name, next, prev) => element[name] = null);
    }

    mergeListeners(element, view) {
        element.$$view.listeners = element.$$view.listeners || {};
        Utils.merge(element.$$view.listeners, view.listeners,
                    (name, next, prev) => {
                        element.removeEventListener(name, prev);
                        element.addEventListener(name, next);
                    },
                    Element.prototype.removeEventListener.bind(element));
    }
}

class InputViewDOMUpdate extends ElementViewDOMUpdate {
    mergeProps(element, view) {
        if (view.props.type === 'text') {
            let {selectionStart, selectionEnd, selectionDirection} = element,
                valueChanged = element.$$view.props && element.$$view.props.value !== view.props.value;

            super.mergeProps(element, view);

            if (valueChanged) {
                element.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
            }
        } else {
            super.mergeProps(element, view);
        }
    }
}

const DefaultDOMUpdates = {
    'text': new TextViewDOMUpdate(),
    'element': new ElementViewDOMUpdate(),
    'input': new InputViewDOMUpdate()
};

const DOM = {

    update(originId, view, updates = DefaultDOMUpdates) {
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
                mergeWithDOM(element, element.childNodes.item(i), view.body[i]);
            }
            for (let i = elementChildrenCnt; i < viewBodyItemCnt; i++) {
                mergeWithDOM(element, null, view.body[i]);
            }
        }

        function mergeWithDOM(parentElement, element, view) {
            if (updates[view.type]) {
                let update = updates[view.type];

                if (!element || update.createNeeded(element, view)) {
                    let newElement = update.create(view);
                    if (element) {
                        parentElement.replaceChild(newElement, element);
                    } else {
                        parentElement.appendChild(newElement);
                    }

                    update.attached(newElement, view);
                    element = newElement;
                }

                if (update.mergeNeeded(element, view)) {
                    update.merge(element, view);

                    if (view.body) {
                        mergeBody(element, view);
                    }
                }

                return element;
            } else {
                return element;
            }
        }

        return mergeWithDOM(origin, origin.childNodes[0], view);
    },

    DOMUpdate,
    updates: DefaultDOMUpdates

};
