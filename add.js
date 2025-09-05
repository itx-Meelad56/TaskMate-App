const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");
const totalTasks = document.getElementById("total-tasks");
const completedTasks = document.getElementById("completed-tasks");
const pendingTasks = document.getElementById("pending-tasks");

// ====== Tasks Array LocalStorage Se Lo ======
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ====== Load Tasks on Page Refresh ======
document.addEventListener("DOMContentLoaded", function () {
    tasks.forEach((task) => {
        createTaskElement(task.text, task.category, task.completed);
    });
    updateStats();
});

// ====== Add Task Button Click ======
addTaskBtn.addEventListener("click", function () {
    const taskText = taskInput.value.trim();
    const taskCategory = categorySelect.value;

    if (taskText === "") {
        alert("⚠️ Please enter a task!");
        return;
    }

    createTaskElement(taskText, taskCategory, false);

    tasks.push({ text: taskText, category: taskCategory, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));

    taskInput.value = "";
    updateStats();
});

// ====== Create Task Element ======
function createTaskElement(taskText, taskCategory, isCompleted) {
    const li = document.createElement("li");
    li.classList.add("task-item");
    if (isCompleted) li.classList.add("completed");

    li.innerHTML = `
        <span>${taskText} <small>(${taskCategory})</small></span>
        <div class="task-buttons">
            <button class="complete-btn">Complete</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;

    taskList.appendChild(li);
}

// ====== Update Task Stats ======
function updateStats() {
    const allTasks = document.querySelectorAll(".task-item");
    const completed = document.querySelectorAll(".task-item.completed");

    totalTasks.textContent = allTasks.length;
    completedTasks.textContent = completed.length;
    pendingTasks.textContent = allTasks.length - completed.length;
}

// ====== Handle Complete / Edit / Delete ======
taskList.addEventListener("click", function (e) {
    const target = e.target;
    const li = target.closest("li");
    const index = Array.from(taskList.children).indexOf(li);

    // ✅ Complete Task
    if (target.classList.contains("complete-btn")) {
        li.classList.toggle("completed");
        tasks[index].completed = li.classList.contains("completed");
        localStorage.setItem("tasks", JSON.stringify(tasks));
        updateStats();
    }

    // 🗑️ Delete Task
    if (target.classList.contains("delete-btn")) {
        if (confirm("⚠️ Are you sure you want to delete this task?")) {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            li.remove();
            updateStats();
        }
    }

    // ✏️ Edit Task
    if (target.classList.contains("edit-btn")) {
        const currentText = li.querySelector("span").innerText.split(" (")[0];
        const newTask = prompt("✏️ Edit your task:", currentText);

        if (newTask && newTask.trim() !== "") {
            tasks[index].text = newTask.trim();
            li.querySelector("span").innerHTML = `${newTask.trim()} <small>(${tasks[index].category})</small>`;
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }
});