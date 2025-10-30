// Load todo HTML and CSS
// FETCH API - Loads the HTML template for the todo app
fetch('./src/components/todo/todo.html')
    .then(response => response.text())  // Convert response to text
    .then(html => {
        // Insert the loaded HTML into the todo-app container
        document.getElementById('todo-app').innerHTML = html;
        
        // DYNAMIC CSS LOADING - Create and append CSS link
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = './src/components/todo/todo.css';
        document.head.appendChild(link);
        
        // Initialize todo functionality after HTML is loaded
        initializeTodoApp();
    });

// MAIN TODO APPLICATION FUNCTION
function initializeTodoApp() {
    // STATE MANAGEMENT - Load todos from localStorage or initialize empty array
    // localStorage persists data between browser sessions
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // CURRENT FILTER STATE - Tracks which filter is active
    let currentFilter = 'all';

    // DOM ELEMENT REFERENCES - Cache references to important elements
    const todoInput = document.getElementById('todoInput');        // Input field
    const addTodoBtn = document.getElementById('addTodoBtn');      // Add button
    const todoList = document.getElementById('todoList');          // List container
    const filterBtns = document.querySelectorAll('.filter-btn');   // Filter buttons
    const totalCount = document.getElementById('totalCount');      // Total counter
    const pendingCount = document.getElementById('pendingCount');  // Pending counter
    const completedCount = document.getElementById('completedCount'); // Completed counter

    // EVENT LISTENERS - Set up user interaction handlers

    // ADD TODO - Listen for click on Add button
    addTodoBtn.addEventListener('click', addTodo);
    
    // KEYBOARD SUPPORT - Listen for Enter key in input field
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();  // Trigger addTodo on Enter key
    });

    // FILTER BUTTONS - Add click handlers to all filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active class from all filter buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
            // Update current filter state from data attribute
            currentFilter = e.target.getAttribute('data-filter');
            // Re-render todos with new filter
            renderTodos();
        });
    });

    // CORE APPLICATION FUNCTIONS

    // ADD TODO FUNCTION - Creates new todo item
    function addTodo() {
        const text = todoInput.value.trim();  // Get and clean input text
        if (text) {  // Only proceed if text is not empty
            const todo = {
                id: Date.now(),  // Unique ID using timestamp
                text: text,      // Todo text content
                completed: false, // Initial completion state
                createdAt: new Date().toISOString()  // Creation timestamp
            };
            todos.push(todo);    // Add new todo to array
            saveTodos();         // Save to localStorage
            renderTodos();       // Update UI
            todoInput.value = ''; // Clear input field
        }
    }

    // TOGGLE TODO FUNCTION - Switches completion state
    function toggleTodo(id) {
        // Map through todos, find matching ID and toggle completed status
        todos = todos.map(todo => 
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        saveTodos();   // Persist changes
        renderTodos(); // Update UI
    }

    // DELETE TODO FUNCTION - Removes todo item
    function deleteTodo(id) {
        // Filter out todo with matching ID
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();   // Persist changes
        renderTodos(); // Update UI
    }

    // SAVE TODOS FUNCTION - Persists data to browser storage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));  // Convert to JSON string
        updateStats();  // Update counter displays
    }

    // UPDATE STATS FUNCTION - Refresh the counter displays
    function updateStats() {
        const total = todos.length;  // Total number of todos
        const completed = todos.filter(todo => todo.completed).length;  // Completed count
        const pending = total - completed;  // Pending count (total - completed)

        // Update DOM elements with new counts
        totalCount.textContent = total;
        completedCount.textContent = completed;
        pendingCount.textContent = pending;
    }

    // RENDER TODOS FUNCTION - Main UI update function
    function renderTodos() {
        // FILTER TODOS - Apply current filter to todo list
        let filteredTodos = todos;
        
        if (currentFilter === 'pending') {
            filteredTodos = todos.filter(todo => !todo.completed);  // Show only incomplete
        } else if (currentFilter === 'completed') {
            filteredTodos = todos.filter(todo => todo.completed);   // Show only complete
        }

        // GENERATE HTML - Create list items from filtered todos
        todoList.innerHTML = filteredTodos.map(todo => `
            <li class="todo-item ${todo.completed ? 'completed' : ''}">
                <!-- Checkbox reflects completion state -->
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <!-- Todo text content -->
                <span class="todo-text">${todo.text}</span>
                <!-- Delete button -->
                <button class="delete-btn">Delete</button>
            </li>
        `).join('');  // join('') converts array to single string

        // ADD DYNAMIC EVENT LISTENERS - Attach handlers to newly created elements

        // CHECKBOX HANDLERS - Toggle completion state
        document.querySelectorAll('.todo-checkbox').forEach((checkbox, index) => {
            checkbox.addEventListener('change', () => toggleTodo(filteredTodos[index].id));
        });

        // DELETE BUTTON HANDLERS - Remove todo items
        document.querySelectorAll('.delete-btn').forEach((button, index) => {
            button.addEventListener('click', () => deleteTodo(filteredTodos[index].id));
        });

        updateStats();  // Refresh counters
    }

    // INITIAL RENDER - Display todos when app first loads
    renderTodos();
}