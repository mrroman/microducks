import 'todomvc-app-css/index.css';
import 'todomvc-common/base.css';
import * as MicroDucks from 'microducks';
import {el, text} from 'microducks';

// application logic

const store = MicroDucks.Store.create({
    filterName: 'all',
    taskName: '',
    nextId: 1,
    tasks: []
});

store.handle('add-item', function (data) {
    if (data.taskName !== '') {
        data.tasks= [{id: data.nextId, text: data.taskName, done: false}, ...data.tasks];
        data.taskName = '';
        data.nextId++;
    }
    return data;
});

store.handle('set-filter', function(data, filterName) {
    data.filterName = filterName;
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

store.handle('update-item', function(data, taskId, props) {
    data.tasks = data.tasks.map((item) => {
        if (item.id === taskId) {
            return {
                id: item.id,
                text: props.text === undefined ? item.text : props.text,
                done: props.done === undefined ? item.done : props.done,
                edit: props.edit === undefined ? item.edit : props.edit
            };
        } else {
            return item;
        }
    });
    return data;
});

store.handle('clear-completed', function(data) {
    data.tasks = data.tasks.filter((task) => !task.done);
    return data;
});

// application view

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
    const checkItem = (e) => {
        store.dispatch('update-item', item.id, {done: !item.done});
    };

    const remove = (e) => {
        store.dispatch('remove-item', item.id);
    };

    const startEditItem = (e) => {
        store.dispatch('update-item', item.id, {edit:true});
    };

    const cancelEditItem = (e) => {
        store.dispatch('update-item', item.id, {edit:false});
    };

    const updateItem = (e) => {
        store.dispatch('update-item', item.id, {edit:false, text: e.target.value});
    };

    if (!item.edit) {
        return el('li')
            .prop('className', item.done ? 'completed' : '')
            .body(el('div')
                  .prop('className', 'view')
                  .body(el('input')
                        .prop('className', 'toggle')
                        .prop('type', 'checkbox')
                        .prop('checked', item.done)
                        .on('change', checkItem),
                        el('label').body(text(item.text)).on('dblclick', startEditItem),
                        el('button').prop('className', 'destroy').on('click', remove)
                       ));
    } else {
        return el('li')
            .prop('className', 'editing')
            .body(el('div')
                  .prop('className', 'view')
                  .body(el('input')
                        .prop('className', 'toggle')
                        .prop('type', 'checkbox')
                        .prop('checked', item.done)
                        .on('change', checkItem),
                        el('label').body(text(item.text)).on('dblclick', startEditItem),
                        el('button').prop('className', 'destroy').on('click', remove)),
                  el('input')
                  .prop('className', 'edit')
                  .prop('type', 'text')
                  .prop('value', item.text)
                  .on('change', updateItem)
                  .on('blur', cancelEditItem));
    }
};

const todoFilter = (type, name, selected) => {
    return el('li')
        .body(el('a')
              .prop('className', selected ? 'selected' : '')
              .on('click', (e) => store.dispatch('set-filter', name))
              .body(text(type)));
};

const todoFooter = MicroDucks.Utils.cache((tasks, filterName) => {
    let todoCount = tasks.filter((task) => !task.done).length;

    return el('footer')
        .prop('className', 'footer')
        .body(el('span')
              .prop('className', 'todo-count')
              .body(el('strong')
                    .body(text(todoCount)),
                    text(' left')),
              el('ul')
              .prop('className', 'filters')
              .body(todoFilter('All', 'all', (filterName === 'all')),
                    todoFilter('Active', 'active', (filterName === 'active')),
                    todoFilter('Completed', 'completed', (filterName === 'completed'))),
              (tasks.length - todoCount > 0) &&
              el('button')
                    .prop('className', 'clear-completed')
                    .on('click', (e) => store.dispatch('clear-completed'))
              .body(text('Clear completed')));
});

const todoList = MicroDucks.Utils.cache(function todoList(tasks) {
    if (tasks.length) {
        return el('section')
            .prop('className', 'main')
            .body(el('ul')
                  .prop('className', 'todo-list')
                  .body(...tasks.map(todoItem)));
    } else {
        return el('div');
    }
});

const todos = (data) => {
    return el('div')
        .body(el('header')
              .prop('className', 'header')
              .body(el('h1')
                    .body(text('todos')),
                    todoAdd(data.taskName)),
              todoList(data.tasks.filter((task) => {
                  switch(data.filterName) {
                  case 'active':
                      return !task.done;
                  case 'completed':
                      return !!task.done;
                  default:
                      return true;
                  }
              })),
              todoFooter(data.tasks, data.filterName));
};

const todoMerger = MicroDucks.VDOM.createMerger('todoapp');
todoMerger(todos(store.data));

store.subscribe(function(data) {
    todoMerger(todos(data));
});
