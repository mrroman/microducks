import * as CoreDucks from 'coreducks.js';
import {el, text} from 'coreducks.js';

let store = CoreDucks.createStore({
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

let todoAdd = CoreDucks.cache(function todoAdd(taskName) {
    return el('input').
        attr('type', 'text').
        attr('value', taskName).
        on('input', (e) => store.dispatch("update-task-name", e.target.value));
});

let todoItem = (item) => {
    return el('li').
        body(text(item.text),
             el('button').on('click', (e) => store.dispatch("remove-item", item.id)).
             body(text('Delete')));
};

let todoList = CoreDucks.cache(function todoList(tasks) {
    return el('ul').body(...tasks.map(todoItem));
});

let todos = CoreDucks.mount('main', (props) => {
    return el('div').body(todoAdd(props.taskName), todoList(props.tasks), text(props.clock));
}, store.data);

store.handle('add-item', function (data) {
    data.tasks= [{id: data.nextId, text: data.taskName, done: false}, ...data.tasks];
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
