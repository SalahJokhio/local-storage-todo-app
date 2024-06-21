let currentUser = null;
let isAdmin = false;

function login() {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Check if both email and password are entered
    if (email === "" || password === "") {
        alert("Please enter both email and password.");
        return;
    }

    // Authentication logic
    if (email === "admin@gmail.com" && password === "admin") {
        currentUser = "admin";
        isAdmin = true;
        showTodoList("admin");
    } else {
        currentUser = email;
        showTodoList(email);
    }
}

function showTodoList(username) {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('todoList').style.display = 'block';
    document.getElementById('userInfo').innerHTML = `Welcome, ${username}`;

    const userEmailElement = document.getElementById('userEmail');
    if (userEmailElement) { // Check if userEmail element exists
        userEmailElement.innerHTML = username;
    }

    if (isAdmin) {
        loadAllUsersTasks();
    } else {
        loadTasks();
    }
}

function addTask() {
    const subjectSelect = document.getElementById('subjectInput');
    const subjectInput = document.getElementById('subjectCustomInput');
    let subject = subjectSelect.value;

    // If the selected option is "custom", use the value from the custom input field
    if (subject === "custom") {
        subject = subjectInput.value.trim(); // Trim any leading/trailing spaces
        // Clear the input field for next usage
        subjectInput.value = "";
    }

    const work = document.getElementById('workInput').value;
    if (!subject) {
        alert("Please select or enter a subject.");
        return;
    }
    if (!work) {
        alert("Please enter the work.");
        return;
    }
    const datetime = new Date().toLocaleString();
    const newTask = { subject: subject, work: work, datetime: datetime };

    const tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
    tasks.push(newTask);
    localStorage.setItem(currentUser, JSON.stringify(tasks));

    // Clear input fields after adding the task
    subjectSelect.value = "";
    workInput.value = "";
    subjectInput.style.display = 'none';

    if (isAdmin) {
        loadAllUsersTasks();
    } else {
        loadTasks();
    }
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
    const tasksDiv = document.getElementById('todos');
    tasksDiv.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.classList.add('task');
        taskItem.innerHTML = `
            <p><strong>Subject:</strong> ${task.subject}</p>
            <p><strong>Work:</strong> ${task.work}</p>
            <p><strong>Date & Time:</strong> ${task.datetime}</p>
            <button onclick="deleteTask('${task.datetime}')">Delete</button>
        `;
        tasksDiv.appendChild(taskItem);
    });
}

function loadAllUsersTasks() {
    const tasksDiv = document.getElementById('todos');
    tasksDiv.innerHTML = '';
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && key !== "admin") {
            const tasks = JSON.parse(localStorage.getItem(key)) || [];
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task');
                taskItem.innerHTML = `
                    <p><strong>User:</strong> ${key}</p>
                    <p><strong>Subject:</strong> ${task.subject}</p>
                    <p><strong>Work:</strong> ${task.work}</p>
                    <p><strong>Date & Time:</strong> ${task.datetime}</p>
                    <button onclick="deleteTask('${task.datetime}', '${key}')">Delete</button>
                `;
                tasksDiv.appendChild(taskItem);
            });
        }
    }
}

function deleteTask(datetime, user = currentUser) {
    let tasks = JSON.parse(localStorage.getItem(user)) || [];
    tasks = tasks.filter(task => task.datetime !== datetime);
    localStorage.setItem(user, JSON.stringify(tasks));
    
    if (isAdmin) {
        loadAllUsersTasks();
    } else {
        loadTasks();
    }
}

function logout() {
    currentUser = null;
    isAdmin = false;
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('todoList').style.display = 'none';
    document.getElementById('userEmail').innerHTML = '';
}

document.getElementById('subjectInput').addEventListener('change', function() {
    const subjectCustomInput = document.getElementById('subjectCustomInput');
    if (this.value === 'custom') {
        subjectCustomInput.style.display = 'block';
    } else {
        subjectCustomInput.style.display = 'none';
    }
});
