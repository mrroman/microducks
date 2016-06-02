let store = createStore({
    taskName: '',
    nextId: 3,
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

let todoAdd = (taskName) => {
    return el('input', {'id': 'aaa',
                        'type': 'text',
                        'value': taskName,
                        'oninput': 'store.dispatch("update-task-name", this.value)'});
};

let todoItem = (item) => {
    return el('li', {},
              text(item.text),
              el('button', {onclick: 'store.dispatch("remove-item", ' + item.id + ')'}, text('Delete')));
};

let todoList = (tasks) => {
    return el('ul', {}, ...tasks.map(todoItem));
};

let todos = mount('main', (props) => {
    return el('div', {}, todoAdd(props.taskName), todoList(props.tasks), text(props.clock));
}, store.data);

store.handle('add-item', function (data) {
    data.tasks.push({id: data.nextId, text: data.taskName, done: false});
    data.nextId++;
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

store.handle('update-task-name', function(data, taskName) {
    data.taskName = taskName;
    return data;
});

store.subscribe(function(data) {
    todos(data);
});

setInterval(() => store.dispatch('refresh-clock'), 1000);
