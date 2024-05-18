document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const clearAllBtn = document.getElementById('clearAllBtn');

    // Load tasks from local storage
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskList.addEventListener('click', handleTaskClick);
    clearAllBtn.addEventListener('click', clearAllTasks);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskBtn.click();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const li = createTaskElement(taskText);
        taskList.appendChild(li);

        saveTasks();
        taskInput.value = '';
    }

    function handleTaskClick(e) {
        if (e.target.classList.contains('delete-btn') || e.target.classList.contains('fa-trash-alt')) {
            e.target.closest('li').remove();
            saveTasks();
        } else if (e.target.classList.contains('edit-btn') || e.target.classList.contains('fa-edit')) {
            editTask(e.target.closest('button'));
        } else if (e.target.classList.contains('save-btn') || e.target.classList.contains('fa-save')) {
            saveEditedTask(e.target.closest('button'));
        } else if (e.target.tagName === 'INPUT' && e.target.type === 'checkbox') {
            e.target.nextElementSibling.classList.toggle('completed');
            saveTasks();
        }
    }

    function clearAllTasks() {
        taskList.innerHTML = '';
        saveTasks();
    }

    function createTaskElement(taskText) {
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const span = document.createElement('span');
        span.textContent = taskText;

        const editBtn = document.createElement('button');
        editBtn.classList.add('edit-btn');
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    function editTask(button) {
        const li = button.parentElement;
        const span = li.querySelector('span');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = span.textContent.trim();
        li.insertBefore(input, span);
        li.removeChild(span);
        button.innerHTML = '<i class="fas fa-save"></i>';
        button.classList.remove('edit-btn');
        button.classList.add('save-btn');
    }

    function saveEditedTask(button) {
        const li = button.parentElement;
        const input = li.querySelector('input[type="text"]');
        const span = document.createElement('span');
        span.textContent = input.value.trim();
        li.insertBefore(span, input);
        li.removeChild(input);
        button.innerHTML = '<i class="fas fa-edit"></i>';
        button.classList.remove('save-btn');
        button.classList.add('edit-btn');
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.querySelector('span').textContent,
                completed: li.querySelector('span').classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const li = createTaskElement(task.text);
            if (task.completed) {
                li.querySelector('span').classList.add('completed');
                li.querySelector('input').checked = true;
            }
            taskList.appendChild(li);
        });
    }
});
