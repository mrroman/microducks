let store = createStore({ counter: 0});
store.handle('raise-counter', (data) => {
    data.counter = data.counter > 255 ? data.counter : data.counter + 16;
    return data;
});

let counter = mount('main', (data) => {
    return fragment(el('div',
                       {style: "color: rgb("+ data.counter +",0,0);"},
                       text('' + data.counter)));
}, store.data);

store.subscribe((data) => {
    counter(data);
});
