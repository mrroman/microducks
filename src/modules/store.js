const Store = {
    create(initialData) {
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
};
