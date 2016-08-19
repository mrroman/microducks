// virtual dom

const VDOM = {
    createMerger(originId) {
        let origin = document.getElementById(originId);

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

        function mergeBody(element, view) {
            if (element.childNodes.length < view.body.length) {
                for (let i = element.childNodes.length; i < view.body.length; i++) {
                    element.appendChild(view.body[i].node());
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
            function mergeTag() {
                if (element.nodeType !== Node.ELEMENT_NODE || element.nodeName.toLowerCase() !== view.name.toLowerCase()) {
                    let newElement = view.node();
                    element.parentNode.replaceChild(newElement, element);
                    element = newElement;
                }

                if (element.$$view !== view) {
                    mergeProps(element, view);
                    mergeListeners(element, view);
                    mergeBody(element, view);
                    if (view.focused) {
                        element.focus();
                    }

                    element.$$view = view;
                }

                return element;
            }

            function mergeText() {
                if (element.nodeType !== Node.TEXT_NODE || element.wholeText !== view.text) {
                    let newElement = view.node();
                    element.parentNode.replaceChild(newElement, element);
                    element = newElement;
                }

                element.$$view = view;
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

        origin.$$view = {};
        return (view) => origin = mergeWithDOM(origin, view);
    }
};
