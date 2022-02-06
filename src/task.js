let taskList = [];

function renderTask(task) {
  localStorage.setItem('taskList', JSON.stringify(taskList));

  const list = document.querySelector('.js-task-list');
  const item = document.querySelector(`[data-key='${task.index}']`);
  
  if (task.deleted) {
    item.remove();
    if (taskList.length === 0) list.innerHTML = '';
    return
  }

  const iscompleted = task.completed ? 'done': '';
  const node = document.createElement("li");
  node.setAttribute('class', `task-item ${iscompleted}`);
  node.setAttribute('data-key', task.index);
  node.innerHTML = `
    <input index="${task.index}" type="checkbox"/>
    <label for="${task.index}" class="tick js-tick"></label>
    <span>${task.text}</span>
    <button class="delete-task js-delete-task">
    <svg><use href="#delete-icon"></use></svg>
    </button>
  `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

function addtask(text) {
  const task = {
    text,
    completed: false,
    index: taskList.length,
  };

  taskList.push(task);
  renderTask(task);
}

function toggleDone(key) {
  const index = taskList.findIndex(item => item.index === Number(key));
  taskList[index].completed = !taskList[index].completed;
  renderTask(taskList[index]);
}

function deletetask(key) {
  const index = taskList.findIndex(item => item.index === Number(key));
  const task = {
    deleted: true,
    ...taskList[index]
  };
  taskList = taskList.filter(item => item.index !== Number(key));
  renderTask(task);
}

const form = document.querySelector('.js-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('.js-task-input');

  const text = input.value.trim();
  if (text !== '') {
    addtask(text);
    input.value = '';
    input.focus();
  }
});

const list = document.querySelector('.js-task-list');
list.addEventListener('click', event => {
  if (event.target.classList.contains('js-tick')) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }
  
  if (event.target.classList.contains('js-delete-task')) {
    const itemKey = event.target.parentElement.dataset.key;
    deletetask(itemKey);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('taskList');
  if (ref) {
    taskList = JSON.parse(ref);
    taskList.forEach(t => {
      renderTask(t);
    });
  }
});