import * as MicroDucks from 'microducks';
import {el, text} from 'microducks';

const store = MicroDucks.createStore({
    taskName: '',
    nextId: 1,
    tasks: []
});

const todoAdd = MicroDucks.cache(function todoAdd(taskName) {
    return el('input')
        .attr('class', 'new-todo')
        .attr('placeholder', 'What needs to be done?')
        .attr('autofocus', 'true')
        .attr('type', 'text')
        .attr('value', taskName)
        .on('input', (e) => store.dispatch("update-task-name", e.target.value))
        .on('change', (e) => store.dispatch('add-item'));
});

const todoItem = (item) => {
    return el('li')
        .body(el('div').attr('class', 'view')
              .body(el('input').attr('class', 'toggle').attr('type', 'checkbox'),
                    el('label').body(text(item.text)),
                    el('button').attr('class', 'destroy').on('click', (e) => store.dispatch("remove-item", item.id))));
};

const todoFilter = (type) => {
    return el('li').body(el('a').attr('class', 'selected').body(text(type)));
};

const todoFooter = MicroDucks.cache((tasks) => {
    return el('footer').attr('class', 'footer')
        .body(el('span').attr('class', 'todo-count')
              .body(el('strong').body(text(tasks.length)),
                    text(' left')),
              el('ul').attr('class', 'filters')
              .body(todoFilter('All'), todoFilter('Active'), todoFilter('Completed')));
});

const todoList = MicroDucks.cache(function todoList(tasks) {
    if (tasks.length) {
        return el('section').attr('class', 'main')
            .body(el('ul')
                  .attr('class', 'todo-list')
                  .body(...tasks.map(todoItem)));
    } else {
        return el('div');
    }
});

const todos = MicroDucks.mount('todoapp', (props) => {
    return el('div')
        .body(el('header')
              .attr('class', 'header')
              .body(el('h1').body(text('todos')),
                    todoAdd(props.taskName)),
              todoList(props.tasks),
              todoFooter(props.tasks));
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

store.handle('update-task-name', function(data, taskName) {
    data.taskName = taskName;
    return data;
});

store.subscribe(function(data) {
    todos(data);
});
