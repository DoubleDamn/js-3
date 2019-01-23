(function module() {
  var addButton = document.getElementById('add');
  var inputTask = document.getElementById('newTask');
  var incompleteTasks = document.getElementById('incompleteTasks');
  var completeTasks = document.getElementById('completedTasks');
  var inputData = document.getElementById('deadline');
  var filterTomorrow = document.getElementById('tomorrow');
  var filterWeek = document.getElementById('week');
  var allTasks = document.getElementById('allTasks');

  //Сreate a new line for task
  function createNewTask(task, deadline) {
    var listItem = document.createElement('li');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    var label = document.createElement('label');
    label.innerText = task;
    var input = document.createElement('input');
    input.type = 'text';
    var labelData = document.createElement('label');
    labelData.className = 'data';
    labelData.innerText = deadline;
    var dataInput = document.createElement('input');
    dataInput.type = 'data';
    dataInput.pattern = '([0-9]{4}-[0-9]{2}-[0-9]{2})';
    var editButton = document.createElement('button');
    editButton.className = 'edit';
    editButton.innerHTML = 'Edit';
    var deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.innerHTML = 'Delete';

    listItem.appendChild(checkbox);
    listItem.appendChild(label);
    listItem.appendChild(labelData);
    listItem.appendChild(input);
    listItem.appendChild(dataInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
  }
  //Add task value
  function addTask() {
    if (inputTask.value) {
      var listItem = createNewTask(inputTask.value, inputData.value);
      incompleteTasks.appendChild(listItem);
      bindTasksEvents(listItem, completeTask);
      inputTask.value = '';
      inputData.value = '';
    }
    save();
  }

  addButton.onclick = addTask;

  //hidden all task
  function hidden() {
    var listLi = document.getElementsByTagName('li');
    [].forEach.call(listLi, function(i) {
      i.style.display = 'none';
    });
  }

//show filter tasks or all tasks
  function show(item) {
    var listLi = document.getElementsByTagName('li');
    if (item) {
      listLi[item].removeAttribute('style');
    } else {
      return function() {
        [].forEach.call(listLi, function(all) {
          all.removeAttribute('style');
        });
      }
    }
  }
  allTasks.onclick = show();

  //filter task for tromorrow
  function tomorrowTask() {
    hidden();
    var now = new Date().setHours(24, 0, 0, 0);
    var listItem = document.querySelectorAll('label.data');
    for (var i = 0; i < listItem.length; i++) {
      var taskDate = new Date(listItem[i].innerText).setHours(0, 0, 0, 0);
      if (now == taskDate) {
        show(i);
      }
    }
  }
  /* Тут повторяющийся код, не знаю как правильно оптимизировать и нужно ли*/

//filter task for this week
  function weekTask() {
    hidden();
    var now = new Date();
    var listItem = document.querySelectorAll('label.data');
    var week = new Date().setDate(now.getDate() + 7);
    for (var i = 0; i < listItem.length; i++) {
      var taskDate = new Date(listItem[i].innerText).setHours(0, 0, 0, 0);
      if (now < taskDate && taskDate <= week) {
        show(i);
      }
    }
  }
  filterWeek.onclick = weekTask;
  filterTomorrow.onclick = tomorrowTask;

  //Edit task value
  function editTask() {
    var listItem = this.parentNode;
    var label = listItem.querySelector('label');
    var dataLabel = listItem.querySelector('label.data');
    var input = listItem.querySelector('input[type=text]');
    var dataInput = listItem.querySelector('input[type=data]');
    var editClass = listItem.classList.contains('editMode');

    if (editClass) {
      label.innerText = input.value;
      dataLabel.innerText = dataInput.value;
      save();
    } else {
      input.value = label.innerText;
      dataInput.value = dataLabel.innerText;
    }
    //Check if edit data value validity
    if (dataInput.checkValidity()) {
      listItem.classList.toggle('editMode');
    }
  }

  //Delete task
  function deleteTask() {
    var listItem = this.parentNode;
    var ui = listItem.parentNode;
    ui.removeChild(listItem);
    save();
  }

  //Check task as complete
  function completeTask() {
    var listItem = this.parentNode;
    completeTasks.appendChild(listItem);
    bindTasksEvents(listItem, incompleteTask);
    save();
  }
  //Check task as incomplete
  function incompleteTask() {
    var listItem = this.parentNode;
    incompleteTasks.appendChild(listItem);
    bindTasksEvents(listItem, completeTask);
    save();
  }

  //button change
  function bindTasksEvents(listItem, checkboxEvent) {
    var checkbox = listItem.querySelector('input[type=checkbox]');
    var editButton = listItem.querySelector('button.edit');
    var deleteButton = listItem.querySelector('button.delete');

    checkbox.onclick = checkboxEvent;
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
  }

  //save in LocalStorage
  function save() {
    var incompleteTaskArr = [];
    var completeTaskArr = [];
    var incompleteDataTaskArr = [];
    var completeDataTaskArr = [];

    for (var i = 0; i < incompleteTasks.children.length; i++) {
      var items = incompleteTasks.children[i].getElementsByTagName('label')[0]
        .innerText;
      incompleteTaskArr.push(items);
      var itemsData = incompleteTasks.children[i].getElementsByTagName(
        'label'
      )[1].innerText;
      incompleteDataTaskArr.push(itemsData);
    }
    for (var i = 0; i < completeTasks.children.length; i++) {
      items = completeTasks.children[i].getElementsByTagName('label')[0]
        .innerText;
      completeTaskArr.push(items);
      itemsData = completeTasks.children[i].getElementsByTagName('label')[1]
        .innerText;
      completeDataTaskArr.push(itemsData);
    }
    localStorage.setItem('todo', JSON.stringify({
        incompleteTasks: incompleteTaskArr,
        completeTasks: completeTaskArr,
        incompleteDataTasks: incompleteDataTaskArr,
        completeDataTasks: completeDataTaskArr
      })
    );
  }

  //load from LocalStorage
  function load() {
    return JSON.parse(localStorage.getItem('todo'));
  }

  //Render page after load
  (function() {
    var dataLoad = load();

    for (var i = 0; i < dataLoad.incompleteTasks.length; i++) {
      var listItem = createNewTask(
        dataLoad.incompleteTasks[i],
        dataLoad.incompleteDataTasks[i]
      );
      incompleteTasks.appendChild(listItem);
      bindTasksEvents(listItem, completeTask);
    }
    for (var i = 0; i < dataLoad.completeTasks.length; i++) {
      listItem = createNewTask(
        dataLoad.completeTasks[i],
        dataLoad.completeDataTasks[i]
      );
      listItem.querySelector('input[type=checkbox]').checked = true;
      completeTasks.appendChild(listItem);
      bindTasksEvents(listItem, incompleteTask);
    }
  })();
})();
