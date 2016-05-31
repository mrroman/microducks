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
    ]
});

let todoItem = (item) => {
    return el('li', {},
              text(item.text),
              el('button', {onclick: 'store.dispatch("remove-item", ' + item.id +')'},
                            text('Delete')));
};

let todoList = (props) => {
    return fragment(el('ul', {},
                       ...props.tasks.map(todoItem)))(props);
};

let todos = mount('main', fragment(todoList), store.data);

store.handle('add-item', function (data) {
    data.tasks.push({id: 3, text: 'Other task', done: false});
    return data;
});

store.handle('remove-item', function(data, itemId) {
    data.tasks = data.tasks.filter((item) => (item.id !== itemId));
    return data;
});

store.subscribe(function(data) {
    todos(data);
});
