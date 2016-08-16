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

const AddTask = store.event('add-task').handle((data) => {
    if (data.taskName !== '') {
        data.tasks= [{id: data.nextId, text: data.taskName, done: false}, ...data.tasks];
        data.taskName = '';
        data.nextId++;
    }
    return data;
});

const UpdateTask = store.event('update-task').handle((data, taskId, props) => {
    data.tasks = data.tasks.map((task) => {
        if (task.id === taskId) {
            return {
                id: task.id,
                text: props.text === undefined ? task.text : props.text,
                done: props.done === undefined ? task.done : props.done,
                edit: props.edit === undefined ? task.edit : props.edit
            };
        } else {
            return task;
        }
    });
    return data;
});

const RemoveTask = store.event('remove-task').handle((data, taskId) => {
    data.tasks = data.tasks.filter((task) => (task.id !== taskId));
    return data;
});

const SetFilter = store.event('set-filter').handle((data, filterName) => {
    data.filterName = filterName;
    return data;
});

const UpdateTaskName = store.event('update-task-name').handle((data, taskName) => {
    data.taskName = taskName;
    return data;
});

const ClearCompleted = store.event('clear-completed').handle((data) => {
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
        .on('input', (e) => UpdateTaskName(e.target.value)())
        .on('change', AddTask());
});

const todoTask = (task) => {
    const cancelEditTask = (e) => {
        e.target.value = task.text;
        UpdateTask(task.id, {edit:false})();
    };

    if (!task.edit) {
        return el('li')
            .prop('className', task.done ? 'completed' : '')
            .body(el('div')
                  .prop('className', 'view')
                  .body(el('input')
                        .prop('className', 'toggle')
                        .prop('type', 'checkbox')
                        .prop('checked', task.done)
                        .on('change', UpdateTask(task.id, {done: !task.done})),
                        el('label')
                        .body(text(task.text))
                        .on('dblclick', UpdateTask(task.id, {edit:true})),
                        el('button')
                        .prop('className', 'destroy')
                        .on('click', RemoveTask(task.id))
                       ));
    } else {
        return el('li')
            .prop('className', 'editing')
            .body(el('div')
                  .prop('className', 'view'),
                  el('input')
                  .prop('className', 'edit')
                  .prop('type', 'text')
                  .prop('value', task.text)
                  .focus()
                  .on('change', (e) => UpdateTask(task.id, {edit:false, text: e.target.value})())
                  .on('keydown', (e) => {
                      if (e.keyCode == 27) {
                          cancelEditTask(e);
                      }
                  })
                  .on('blur', cancelEditTask));
    }
};

const todoFilter = (type, name, selected) => {
    return el('li')
        .body(el('a')
              .prop('className', selected ? 'selected' : '')
              .on('click', SetFilter(name))
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
              .on('click', ClearCompleted())
              .body(text('Clear completed')));
});

const todoList = MicroDucks.Utils.cache(function todoList(tasks) {
    if (tasks.length) {
        return el('section')
            .prop('className', 'main')
            .body(el('ul')
                  .prop('className', 'todo-list')
                  .body(...tasks.map(todoTask)));
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
