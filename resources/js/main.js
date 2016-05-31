let store = createStore({
    tasks: [
        {
            id: 1,
            text: 'Important task',
            done: false
        },
        {
            id: 2,
            text: 'Important task 2',
            done: true
        }
    ],
    clock: ''
});

let todoItem = (item) => {
    return el('li', {},
              text(item.text),
              listen(el('button', {}, text('Delete')), 'click', () => { store.dispatch("remove-item", item.id); }));
};

let todoList = (tasks) => {
    return fragment(el('ul', {}, ...tasks.map(todoItem)));
};

let todos = mount('main', (props) => {
    return fragment(todoList(props.tasks), text(props.clock));
}, store.data);

store.handle('add-item', function (data) {
    data.tasks.push({id: 3, text: 'Other task', done: false});
    return data;
});

store.handle('remove-item', function(data, itemId) {
    data.tasks = data.tasks.filter((item) => (item.id !== itemId));
    return data;
});

store.handle('refresh-clock', function(data) {
    data.clock = new Date().toUTCString();
    return data;
});

store.subscribe(function(data) {
    todos(data);
});

setInterval(() => store.dispatch('refresh-clock'), 1000);
