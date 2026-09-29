const taskTitle = document.getElementById("taskTitle");
const taskDescription = document.getElementById("taskDescription");
const taskPriority = document.getElementById("taskPriority");
const taskDate = document.getElementById("taskDate");

const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const searchTask = document.getElementById("searchTask");
const priorityFilter = document.getElementById("priorityFilter");

const formMessage = document.getElementById("formMessage");
$("#addTaskModal").on("show.bs.modal", function () {
    formMessage.classList.add("d-none");
});

searchTask.addEventListener("input", function () {
    displayTasks();
});

priorityFilter.addEventListener("change", function () {
    displayTasks();
});

let tasks = [];

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
}

function updateCounters() {

    totalTasks.textContent = tasks.length;

    // Completed Task
    completedTasks.textContent = tasks.filter(function (task) {
        return task.completed === true;
    }).length;

    // Pending Task
    pendingTasks.textContent = tasks.length - tasks.filter(function (task) {
        return task.completed === true;
    }).length;

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

let editTaskId = null;

// add task button

addTaskBtn.addEventListener("click", function () {
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const priority = taskPriority.value;
    const date = taskDate.value;

    if (title === "" || description === "" || priority === "" || date === "") {
        formMessage.textContent = "Please fill all fields.";
        formMessage.classList.remove("d-none");
        return;
    }

    const task = {
        id: Date.now(),
        title: title,
        description: description,
        priority: priority,
        date: date,
        completed: false
    };

    if (editTaskId != null) {
        const taskIndex = tasks.findIndex(function (task) {
            return task.id == editTaskId;
        });
        tasks[taskIndex].title = title;
        tasks[taskIndex].description = description;
        tasks[taskIndex].priority = priority;
        tasks[taskIndex].date = date;
    }
    else {
        tasks.push(task);
    }

    editTaskId = null;
    $("#addTaskModal").modal("hide");
    document.querySelector("form").reset();

    updateCounters();

    displayTasks();

})


// display tasks

function displayTasks() {

    // 1. Search aur filter ki values
    const searchValue = searchTask.value.toLowerCase();
    const priorityValue = priorityFilter.value;

    // 2. Tasks ko filter karna
    const filteredTasks = tasks.filter(function (task) {

        const matchesSearch = task.title.toLowerCase().includes(searchValue);

        const matchesPriority = priorityValue === "All Priority" || task.priority === priorityValue;

        return matchesSearch && matchesPriority;
    })

    // 3. Purane cards remove karna
    taskList.innerHTML = " ";

    if (filteredTasks.length === 0) {
        taskList.innerHTML =
            `<div class = "alert alert-info text-center">
        No tasks found.
        </div>
        `;
        return;
    }


    // 4. Sirf filtered tasks ke cards banana
    filteredTasks.forEach(function (task) {

        let completedClass = "";
        if (task.completed === true) {
            completedClass = "text-muted completed-task";
        }

        const taskCard = `
         <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title ${completedClass}">${task.title}</h5>
                        <p class="card-text">${task.description}</p>
                        <p class="mb-2 date"><strong>Due Date:</strong> ${task.date}</p>
                        <p class="mb-3 priority"><strong>Priority:</strong>
                            <span class="badge ${task.priority === "High" ? "badge-danger" : task.priority === "Medium" ?
                "badge-warning" : "badge-success"}">${task.priority}</span>
                        </p>

                        <button class="btn ${task.completed ? "btn-secondary" : "btn-success"} mr-2 complete-btn" data-id="${task.id}">
                        <i class="fa-solid fa-check"></i> ${task.completed ? "Undo" : "Complete"}
                        </button>

                        <button class="btn btn-primary mr-2 edit-btn" data-id="${task.id}">
                        <i class="fa-solid fa-pen-to-square"></i> Edit
                        </button>

                        <button class="btn btn-danger delete-btn" data-id="${task.id}">
                        <i class="fa-notdog-duo fa-solid fa-trash"></i> Delete
                         </button>
                    </div>
                </div> `
            ;
        taskList.innerHTML += taskCard;
    });

    // Delete Button
    const deleteBtn = document.querySelectorAll(".delete-btn");

    deleteBtn.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const taskId = btn.getAttribute("data-id");

            tasks = tasks.filter(function (task) {
                return task.id != taskId;
            });

            updateCounters();
            displayTasks();
        });
    });

    // Complete Button
    const completeBtn = document.querySelectorAll(".complete-btn");

    completeBtn.forEach(function (btn) {
        btn.addEventListener("click", function () {
            const taskId = btn.getAttribute("data-id");

            const task = tasks.find(function (task) {
                return task.id == taskId;
            });

            task.completed = !task.completed;

            updateCounters();

            displayTasks();

        });
    });

    // Edit Button
    const editBtn = document.querySelectorAll(".edit-btn");
    editBtn.forEach(function (btn) {

        btn.addEventListener("click", function () {

            const taskId = btn.getAttribute("data-id");

            editTaskId = taskId;

            const task = tasks.find(function (task) {
                return task.id == taskId;
            });

            taskTitle.value = task.title;
            taskDescription.value = task.description;
            taskPriority.value = task.priority;
            taskDate.value = task.date;

            $("#addTaskModal").modal("show");

        });
    });

}

displayTasks();
updateCounters();