let tasks = [];
let filterDate = null;

const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const filterDateInput = document.getElementById('filterDateInput');
const filterBtn = document.getElementById('filterBtn');
const clearFilterBtn = document.getElementById('clearFilterBtn');
const deleteAllBtn = document.getElementById('deleteAllBtn');

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
filterBtn.addEventListener('click', applyDateFilter);
clearFilterBtn.addEventListener('click', clearFilter);
deleteAllBtn.addEventListener('click', deleteAllTasks);

window.addEventListener('load', () => {
    renderTasks();
});

function addTask() {
    const taskName = taskInput.value.trim();
    const dueDate = dateInput.value;

    if (!taskName) {
        alert('Please enter a task!');
        return;
    }

    if (!dueDate) {
        alert('Please select a due date!');
        return;
    }

    const task = {
        id: Date.now(),
        name: taskName,
        date: dueDate,
        completed: false
    };

    tasks.push(task);
    taskInput.value = '';
    dateInput.value = '';
    renderTasks();
}

function renderTasks() {
    let tasksToShow = filterDate 
        ? tasks.filter(task => task.date === filterDate) 
        : tasks;

    if (tasksToShow.length === 0) {
        const message = filterDate 
            ? 'No tasks found for selected date' 
            : 'No task found';
        taskList.innerHTML = `<div class="no-task">${message}</div>`;
        return;
    }

    taskList.innerHTML = '';
    tasksToShow.forEach(task => {
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
    });
}

function createTaskElement(task) {
    const taskItem = document.createElement('div');
    taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    const formattedDate = formatDate(task.date);

    taskItem.innerHTML = `
        <div class="task-name">${task.name}</div>
        <div class="task-date">${formattedDate}</div>
        <div>
            <span class="status-badge ${task.completed ? 'status-completed' : 'status-pending'}">
                ${task.completed ? 'Completed' : 'Pending'}
            </span>
        </div>
        <div class="task-actions">
            <button class="btn-complete" onclick="toggleComplete(${task.id})">
                ${task.completed ? 'Undo' : 'Done'}
            </button>
            <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;

    return taskItem;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function toggleComplete(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

function applyDateFilter() {
    const selectedDate = filterDateInput.value;
    
    if (!selectedDate) {
        alert('Please select a date to filter!');
        return;
    }

    filterDate = selectedDate;
    filterBtn.classList.add('active');
    renderTasks();
}

function clearFilter() {
    filterDate = null;
    filterDateInput.value = '';
    filterBtn.classList.remove('active');
    renderTasks();
}

function deleteAllTasks() {
    if (tasks.length === 0) {
        alert('No tasks to delete!');
        return;
    }

    if (confirm('Are you sure you want to delete all tasks?')) {
        tasks = [];
        clearFilter();
        renderTasks();
    }
}