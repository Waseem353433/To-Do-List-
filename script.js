const taskForm = document.getElementById('taskForm');
    const taskInput = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskStatus = document.getElementById('taskStatus');
    const completedCount = document.getElementById('completedCount');
    const clearCompleted = document.getElementById('clearCompleted');
    const filterButtons = document.querySelectorAll('[data-filter]');

    const STORAGE_KEY = 'beautifulTodoTasks';
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    let activeFilter = 'all';

    function saveTasks() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function createTaskItem(task) {
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const label = document.createElement('label');
      label.textContent = task.text;
      label.title = 'Click the checkbox to toggle completion';

      const actions = document.createElement('div');
      actions.className = 'actions';

      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = task.completed ? 'Done' : 'Pending';

      const deleteButton = document.createElement('button');
      deleteButton.type = 'button';
      deleteButton.textContent = '✕';
      deleteButton.title = 'Remove task';
      deleteButton.addEventListener('click', () => {
        tasks = tasks.filter((item) => item.id !== task.id);
        saveTasks();
        renderTasks();
      });

      actions.append(badge, deleteButton);
      li.append(checkbox, label, actions);
      return li;
    }

    function renderTasks() {
      taskList.innerHTML = '';
      const filteredTasks = tasks.filter((task) => {
        if (activeFilter === 'active') return !task.completed;
        if (activeFilter === 'completed') return task.completed;
        return true;
      });

      if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.className = 'task-item';
        emptyMessage.style.justifyContent = 'center';
        emptyMessage.textContent = 'No tasks yet. Add a new task to get started!';
        taskList.appendChild(emptyMessage);
      } else {
        filteredTasks.forEach((task) => taskList.appendChild(createTaskItem(task)));
      }

      const total = tasks.length;
      const completed = tasks.filter((task) => task.completed).length;
      taskStatus.textContent = `${total} ${total === 1 ? 'task' : 'tasks'} total`;
      completedCount.textContent = `${completed} ${completed === 1 ? 'completed' : 'completed'}`;
    }

    function addTask(text) {
      const trimmed = text.trim();
      if (!trimmed) return;
      tasks.unshift({
        id: Date.now().toString(),
        text: trimmed,
        completed: false,
      });
      saveTasks();
      renderTasks();
      taskInput.value = '';
      taskInput.focus();
    }

    taskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      addTask(taskInput.value);
    });

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        filterButtons.forEach((btn) => btn.classList.remove('active'));
        button.classList.add('active');
        activeFilter = button.dataset.filter;
        renderTasks();
      });
    });

    clearCompleted.addEventListener('click', () => {
      tasks = tasks.filter((task) => !task.completed);
      saveTasks();
      renderTasks();
    });

    window.addEventListener('load', renderTasks);