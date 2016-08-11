import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';
import * as MicroDucks from 'microducks';
import {el, text} from 'microducks';

const store = MicroDucks.Store.create({
    taskName: '',
    nextId: 1,
    tasks: []
});

const todoAdd = MicroDucks.Utils.cache(function todoAdd(taskName) {
    return el('input')
        .prop('className', 'new-todo')
        .prop('placeholder', 'What needs to be done?')
        .prop('autofocus', 'true')
        .prop('type', 'text')
        .prop('value', taskName)
        .on('input', (e) => store.dispatch("update-task-name", e.target.value))
        .on('change', (e) => store.dispatch('add-item'));
});

const todoItem = (item) => {
    return el('li')
        .prop('className', item.done ? 'completed' : '')
        .body(el('div').prop('className', 'view')
              .body(el('input').prop('className', 'toggle').prop('type', 'checkbox').prop('checked', item.done).on('change', (e) => { store.dispatch("check-item", item.id);}),
                    el('label').body(text(item.text)),
                    el('button').prop('className', 'destroy').on('click', (e) => store.dispatch("remove-item", item.id))));
};

const todoFilter = (type) => {
    return el('li').body(el('a').prop('className', 'selected').body(text(type)));
};

const todoFooter = MicroDucks.Utils.cache((tasks) => {
    return el('footer').prop('className', 'footer')
        .body(el('span').prop('className', 'todo-count')
              .body(el('strong').body(text(tasks.length)),
                    text(' left')),
              el('ul').prop('className', 'filters')
              .body(todoFilter('All'), todoFilter('Active'), todoFilter('Completed')));
});

const todoList = MicroDucks.Utils.cache(function todoList(tasks) {
    if (tasks.length) {
        return el('section').prop('className', 'main')
            .body(el('ul')
                  .prop('className', 'todo-list')
                  .body(...tasks.map(todoItem)));
    } else {
        return el('div');
    }
});

const todos = MicroDucks.mount('todoapp', (props) => {
    return el('div')
        .body(el('header')
              .prop('className', 'header')
              .body(el('h1').body(text('todos')),
                    todoAdd(props.taskName)),
              todoList(props.tasks),
              todoFooter(props.tasks));
}, store.data);

store.handle('add-item', function (data) {
    if (data.taskName !== '') {
        data.tasks= [{id: data.nextId, text: data.taskName, done: false}, ...data.tasks];
        data.taskName = '';
        data.nextId++;
    }
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

store.handle('check-item', function(data, itemId) {
    data.tasks = data.tasks.map((item) => {
        if (item.id === itemId) {
            return {
                id: item.id,
                text: item.text,
                done: !item.done
            };
        } else {
            return item;
        }
    });
    return data;
})

store.subscribe(function(data) {
    todos(data);
});
