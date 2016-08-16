const Store = {
    create(initialData) {
        const ev = document.createDocumentFragment();
        ev.data = initialData || {};

        ev.subscribe = (handler) => {
            ev.addEventListener('$$updated', (e) => {
                handler(e.target.data);
            });
        };

        ev.event = (eventType) => {
            const dispatcher = (...args) => {
                return () => {
                    let event = new Event(eventType);
                    event.args = args;
                    ev.dispatchEvent(event);
                };
            };

            dispatcher.handle = (handler) => {
                ev.addEventListener(eventType, (e) => {
                    e.target.data = handler(e.target.data, ...e.args);
                    ev.dispatchEvent(new Event('$$updated'));
                });
                return dispatcher;
            };

            return dispatcher;
        };

        return ev;
    }
};
