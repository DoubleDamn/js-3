var addButton = document.getElementById('add');
var inputTask = document.getElementById('new-task');
var incompleteTasks = document.getElementById('incomplete-tasks');
var completeTasks = document.getElementById('completed-tasks');
var inputData = document.getElementById('deadline');

function createNewTask(task) {
  var listItem = document.createElement('li');
  var checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  var label = document.createElement('label');
  label.innerText = task;
  var input = document.createElement('input');
  input.type = 'text';
  var editButton = document.createElement('button');
  editButton.className = 'edit';
  editButton.innerHTML = 'Edit';
  var deleteButton = document.createElement('button');
  deleteButton.className = 'delete';
  deleteButton.innerHTML = 'Delete';

  listItem.appendChild(checkbox);
  listItem.appendChild(label);
  listItem.appendChild(input);
  listItem.appendChild(editButton);
  listItem.appendChild(deleteButton);

  return listItem;
}

function addTask() {
  if (inputTask.value) {
    var listItem = createNewTask(inputTask.value);
    incompleteTasks.appendChild(listItem);
    bindTasksEvents(listItem, completeTask);
    inputTask.value = '';
  }
  save();
}

addButton.onclick = addTask;

function editTask() {
  var listItem = this.parentNode;
  var label = listItem.querySelector('label');
  var input = listItem.querySelector('input[type=text]');
  var editClass = listItem.classList.contains('editMode');

  if (editClass) {
    label.innerText = input.value;
    save();
  } else {
    input.value = label.innerText;
  }
  listItem.classList.toggle('editMode');
}

function deleteTask() {
  var listItem = this.parentNode;
  var ui = listItem.parentNode;
  ui.removeChild(listItem);
  save();
}

function completeTask() {
  var listItem = this.parentNode;
  

  completeTasks.appendChild(listItem);
  bindTasksEvents(listItem, incompleteTask);
  save();
}

function incompleteTask() {
  var listItem = this.parentNode;


  incompleteTasks.appendChild(listItem);
  bindTasksEvents(listItem, completeTask);
  save();
}

function bindTasksEvents(listItem, checkboxEvent) {
  var checkbox = listItem.querySelector('input[type=checkbox]');
  var editButton = listItem.querySelector('button.edit');
  var deleteButton = listItem.querySelector('button.delete');

  checkbox.onclick = checkboxEvent;
  editButton.onclick = editTask;
  deleteButton.onclick = deleteTask;
}

function save() {
  var incompleteTaskArr = [];
  var completeTaskArr = [];

  for (var i = 0; i < incompleteTasks.children.length; i++) {
    var items = incompleteTasks.children[i].getElementsByTagName('label')[0].innerText;
    incompleteTaskArr.push(items);
  }
  for (var i = 0; i < completeTasks.children.length; i++) {
     items = completeTasks.children[i].getElementsByTagName('label')[0].innerText;
    completeTaskArr.push(items);
  }
  localStorage.setItem('todo', JSON.stringify({
      incompleteTasks: incompleteTaskArr,
      completeTasks: completeTaskArr,
    })
  );
}

function load() {
  return JSON.parse(localStorage.getItem('todo'));
}

var dataLoad = load();
for (var i = 0; i < dataLoad.incompleteTasks.length; i++) {
  var listItem = createNewTask(dataLoad.incompleteTasks[i]);
  incompleteTasks.appendChild(listItem);
  bindTasksEvents(listItem, completeTask);
}
for (var i = 0; i < dataLoad.completeTasks.length; i++) {
  listItem = createNewTask(dataLoad.completeTasks[i]);
  listItem.querySelector('input[type=checkbox]').checked = true;
  completeTasks.appendChild(listItem);
  bindTasksEvents(listItem, incompleteTask);
}
