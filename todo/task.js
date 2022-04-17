const STORAGEKEY = 'myData';

const form = document.querySelector('.tasks__control');
const input = form.querySelector('.tasks__input');
const tasks = document.querySelector('.tasks__list');

renderFromLocalStorage()

function createNewTask(value) {
  const newTask = document.createElement('div', )
  newTask.classList.add('task')

  newTask.innerHTML = `<div class="task__title">
    ${value}
  </div>
  <a href="#" class="task__remove">&times;</a>`;

  const taskRemove = newTask.querySelector('.task__remove');
  taskRemove.onclick = () => false;
  taskRemove.addEventListener('click', () => {
    const value = newTask.querySelector('.task__title').innerText;
    deleteTaskFromLocalStorage(value);
    newTask.remove();
  })
  tasks.insertAdjacentElement('beforeend', newTask);
}

function getLocalStorage() {
  const data = localStorage.getItem(STORAGEKEY);
  if (!data) {
    return []
  }
  return data.split(',')
}

function saveTaskToLocalStorage(task) {
  const storage = getLocalStorage();
  storage.push(task);
  localStorage.setItem(STORAGEKEY, storage);
}

function deleteTaskFromLocalStorage(task) {
  const storage = getLocalStorage();
  storage.splice(storage.indexOf(task), 1);

  localStorage.setItem(STORAGEKEY, storage);
}

function renderFromLocalStorage() {
  for (let task of getLocalStorage()) {
    createNewTask(task);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (input.value) {
    createNewTask(input.value)
    saveTaskToLocalStorage(input.value);
    input.value = '';
  }
})