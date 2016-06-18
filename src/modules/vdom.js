// virtual dom

function mount(originId, f, props = {}) {
    let origin = document.getElementById(originId);

    function mergeAttributes(element, view) {
        Utils.merge(element.$$coreducks.attrs, view.attrs,
              Element.prototype.setAttribute.bind(element), Element.prototype.removeAttribute.bind(element));
    }

    function mergeListeners(element, view) {
        Utils.merge(element.$$coreducks.listeners, view.listeners,
                    (name, next, prev) => {
                        element.removeEventListener(name, prev);
                        element.addEventListener(name, next);
                    },
                    Element.prototype.removeEventListener.bind(element));
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
