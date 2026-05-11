// To-Do List Application with Local Storage

const STORAGE_KEY = 'octofit_todos';
let todos = [];
let currentFilter = 'all';

// DOM Elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const filterBtns = document.querySelectorAll('.filter-btn');
const clearBtn = document.getElementById('clearBtn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// Initialize app
function init() {
    loadTodos();
    render();
    attachEventListeners();
}

// Load todos from local storage
function loadTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    todos = stored ? JSON.parse(stored) : [];
}

// Save todos to local storage
function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Add event listeners
function attachEventListeners() {
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            render();
        });
    });

    clearBtn.addEventListener('click', clearCompleted);
}

// Add a new todo
function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const newTodo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
    };

    todos.unshift(newTodo);
    saveTodos();
    todoInput.value = '';
    todoInput.focus();
    render();
}

// Toggle todo completion status
function toggleTodo(id) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }
}

// Delete a todo
function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    saveTodos();
    render();
}

// Clear all completed todos
function clearCompleted() {
    if (confirm('Are you sure you want to delete all completed tasks?')) {
        todos = todos.filter((t) => !t.completed);
        saveTodos();
        render();
    }
}

// Get filtered todos
function getFilteredTodos() {
    switch (currentFilter) {
        case 'active':
            return todos.filter((t) => !t.completed);
        case 'completed':
            return todos.filter((t) => t.completed);
        default:
            return todos;
    }
}

// Update statistics
function updateStats() {
    const completed = todos.filter((t) => t.completed).length;
    totalCount.textContent = todos.length;
    completedCount.textContent = completed;
    clearBtn.disabled = completed === 0;
}

// Render the todo list
function render() {
    const filteredTodos = getFilteredTodos();
    updateStats();

    // Clear the list
    todoList.innerHTML = '';

    if (filteredTodos.length === 0) {
        todoList.innerHTML = `
            <div class="empty-state">
                <p>✨ No tasks here! Great job or add a new one to get started.</p>
            </div>
        `;
        return;
    }

    // Render todos
    filteredTodos.forEach((todo) => {
        const todoItem = document.createElement('div');
        todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoItem.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            />
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        todoList.appendChild(todoItem);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Start the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
