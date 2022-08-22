//////////////////////////////////////////////////////////////////
//                          variables                          //
//////////////////////////////////////////////////////////////////

let tasksSection = document.querySelector(".tasks-section");
let addBtn = document.querySelector(".add-btn");
let addText = document.querySelector(".add-text");
let clearAllBtn = document.querySelector(".clear-all-btn");
tasksList = []; // all local storage is here

//////////////////////////////////////////////////////////////////
//                 functions & events                           //
//////////////////////////////////////////////////////////////////
function createNewTask(task) {
  let newTask = document.createElement("div");
  newTask.className = "task";
  newTask.id = task.id;
  let taskText = document.createElement("div");
  taskText.className = "task-text";
  let check = document.createElement("input");
  check.type = "checkbox";
  check.className = "check";
  let lbl = document.createElement("label");
  lbl.className = "text";

  let delBtn = document.createElement("button");
  delBtn.className = "task-del";
  delBtn.innerHTML = "X";
  lbl.innerHTML = task.title;
  taskText.appendChild(check);
  taskText.appendChild(lbl);

  newTask.appendChild(taskText);
  newTask.appendChild(delBtn);
  tasksSection.prepend(newTask);
  return newTask;
}

function showSwtAlert(txt) {
  Swal.fire({
    title: "Empty task!",
    text: txt,
    icon: "question",
    confirmButtonText: "Ok",
  });
}
function taskExisiting() {
  if (tasksList.length) return true;
  return false;
}

function addNewTask() {
  if (addText.value != "") {
    let ID = Date.now();
    const taskPkg = {
      id: ID,
      title: addText.value,
      completed: false,
    };
    createNewTask(taskPkg);
    //creation and appending in local storage
    tasksList.push(taskPkg);
    let stringfyList = JSON.stringify(tasksList);
    window.localStorage.clear();
    window.localStorage.setItem("tasks", stringfyList);
    addText.value = "";
  } else {
    showSwtAlert("Please enter a task");
  }
}
window.onload = function () {
  addText.focus();
};
// restoring tasks from local storage
if (window.localStorage.tasks) {
  let lst = JSON.parse(window.localStorage.getItem("tasks"));
  console.log(window.localStorage.tasks);
  lst.forEach((element) => {
    console.log(element);
    let newTask = createNewTask(element);
    tasksList.push(element);
    if (element.completed) {
      newTask.children[0].children[0].checked = true;
    }
  });
}

// clicking + button
addBtn.addEventListener("click", addNewTask);
// pressing a Enter key
addText.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    addBtn.click();
  }
});

//clicking on x button
document.addEventListener("click", function (event) {
  if (event.target.className == "task-del") {
    let task = event.target.parentElement;
    // remove this task from local storage
    tasksList = tasksList.filter((element) => {
      console.log(element.id, task.id);
      return +element.id !== +task.id;
    });
    //remove from page
    event.target.parentElement.remove();
    //update local storage
    let stringfyList = JSON.stringify(tasksList);
    window.localStorage.clear();
    window.localStorage.setItem("tasks", stringfyList);
  }
});

//clicking on clear all button
clearAllBtn.addEventListener("click", function (event) {
  console.log(event.target.parentElement.children);
  //remove all tasks from page
  while (tasksSection.firstChild) {
    if (tasksSection.firstChild.className == "btns") {
      break;
    }
    tasksSection.removeChild(tasksSection.firstChild);
  }
  //remove all tasks from local storage
  tasksList = [];
  window.localStorage.clear();
});

//clicking on checkbox
document.addEventListener("click", function (event) {
  if (event.target.className === "check") {
    // update local storage - marking completed tasks
    tasksList.forEach(function (elem) {
      if (elem.id == event.target.parentElement.parentElement.id) {
        elem.completed = event.target.checked ? true : false;
      }
    });

    let stringfyList = JSON.stringify(tasksList);
    window.localStorage.clear();
    window.localStorage.setItem("tasks", stringfyList);
  }
});

//clicking on clear completed button
document.addEventListener("click", function (event) {
  if (event.target.className == "clear-all-checked-btn") {
    //remove all completed tasks from page
    let tasks = document.querySelectorAll(".task");
    tasks.forEach((element) => {
      if (element.children[0].children[0].checked) {
        element.remove();
      }
    });
    //remove all completed tasks from local storage
    tasksList = tasksList.filter((element) => {
      return element.completed == false;
    });
    //update local storage
    let stringfyList = JSON.stringify(tasksList);
    window.localStorage.clear();
    window.localStorage.setItem("tasks", stringfyList);
  }
});
