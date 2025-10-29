// Load todo HTML and CSS
fetch('./src/components/todo/todo.html')
    .then(response => response.text())
    .then(html => {
        document.getElementById('todo-app').innerHTML = html;
        
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './src/components/todo/todo.css';
        document.head.appendChild(link);
        
        // Initialize todo functionality
        initializeTodoApp();
    });

function initializeTodoApp() {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentFilter = 'all';

    const todoInput = document.getElementById('todoInput');
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoList = document.getElementById('todoList');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const totalCount = document.getElementById('totalCount');
    const pendingCount = document.getElementById('pendingCount');
    const completedCount = document.getElementById('completedCount');

    // Event Listeners
    addTodoBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.getAttribute('data-filter');
            renderTodos();
        });
    });

    // Functions
    function addTodo() {
        const text = todoInput.value.trim();
        if (text) {
            const todo = {
                id: Date.now(),
                text: text,
                completed: false,
                createdAt: new Date().toISOString()
            };
            todos.push(todo);
            saveTodos();
            renderTodos();
            todoInput.value = '';
        }
    }

    function toggleTodo(id) {
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();
        renderTodos();
    }

    function deleteTodo(id) {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
        updateStats();
    }

    function updateStats() {
        const total = todos.length;
        const completed = todos.filter(todo => todo.completed).length;
        const pending = total - completed;

        totalCount.textContent = total;
        completedCount.textContent = completed;
        pendingCount.textContent = pending;
    }

    function renderTodos() {
        let filteredTodos = todos;
        
        if (currentFilter === 'pending') {
            filteredTodos = todos.filter(todo => !todo.completed);
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);
        }

        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn">Delete</button>
            </li>
        `).join('');

        // Add event listeners to checkboxes and delete buttons
        document.querySelectorAll('.todo-checkbox').forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => toggleTodo(filteredTodos[index].id));
        });

        document.querySelectorAll('.delete-btn').forEach((button, index) => {
            button.addEventListener('click', () => deleteTodo(filteredTodos[index].id));
        });

        updateStats();
    }

    // Initial render
    renderTodos();
}