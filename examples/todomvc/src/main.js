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
        e.target.value = item.text;
        store.dispatch('update-item', item.id, {edit:false});
    };

    const updateItem = (e) => {
        store.dispatch('update-item', item.id, {edit:false, text: e.target.value});
    };

    if (!item.edit) {
        return el('li')
            .propIf(item.done, 'className', 'completed')
            .has(el('div')
                  .prop('className', 'view')
                  .has(el('input')
                        .prop('className', 'toggle')
                        .prop('type', 'checkbox')
                        .prop('checked', item.done)
                        .on('change', checkItem),
                        el('label').has(text(item.text)).on('dblclick', startEditItem),
                        el('button').prop('className', 'destroy').on('click', remove)
                       ));
    } else {
        return el('li')
            .prop('className', 'editing')
            .has(el('div')
                  .prop('className', 'view'),
                  el('input')
                  .prop('className', 'edit')
                  .prop('type', 'text')
                  .prop('value', item.text)
                  .focus()
                  .on('change', updateItem)
                  .on('keydown', (e) => {
                      if (e.keyCode == 27) {
                          cancelEditItem(e);
                      }
                  })
                  .on('blur', cancelEditItem));
    }
};

const todoFilter = (type, name, selected) => {
    return el('li')
        .has(el('a')
             .propIf(selected, 'className', 'selected')
             .on('click', (e) => store.dispatch('set-filter', name))
             .has(text(type)));
};

const todoFooter = MicroDucks.Utils.cache((tasks, filterName) => {
    let todoCount = tasks.filter((task) => !task.done).length;

    let filterButtons = el('ul')
        .prop('className', 'filters')
        .has(todoFilter('All', 'all', (filterName === 'all')),
             todoFilter('Active', 'active', (filterName === 'active')),
             todoFilter('Completed', 'completed', (filterName === 'completed')));

    let counter = el('span')
        .prop('className', 'todo-count')
        .has(el('strong')
             .has(text(todoCount)),
             text(' left'));

    let clearCompleted = el('button')
        .prop('className', 'clear-completed')
        .on('click', (e) => store.dispatch('clear-completed'))
        .has(text('Clear completed'));

    let footer = el('footer')
        .prop('className', 'footer')
        .has(counter, filterButtons)
        .hasIf(tasks.length - todoCount > 0, clearCompleted);

    return footer;
});

const todoList = MicroDucks.Utils.cache(function todoList(tasks) {
    if (tasks.length) {
        return el('section')
            .prop('className', 'main')
            .has(el('ul')
                  .prop('className', 'todo-list')
                  .has(...tasks.map(todoItem)));
    } else {
        return el('div');
    }
});

const todos = (data) => {
    return el('div')
        .has(el('header')
              .prop('className', 'header')
              .has(el('h1')
                    .has(text('todos')),
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
