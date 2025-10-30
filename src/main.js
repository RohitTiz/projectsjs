// MODULE IMPORTS - Importing component functionality
// These are ES6 module imports that load other JavaScript files
import './components/todo/todo.js';        // Todo list functionality
import './components/githubProfile/githubProfile.js';  // GitHub profile functionality

// TAB SWITCHING FUNCTIONALITY

// DOM SELECTORS - Getting references to HTML elements
// querySelectorAll returns a NodeList (array-like object) of all matching elements
const tabButtons = document.querySelectorAll('.tab-button');    // All tab buttons
const tabContents = document.querySelectorAll('.tab-content');  // All content areas

// EVENT LISTENERS - Adding click handlers to each tab button
// forEach loops through each button in the NodeList
tabButtons.forEach(button => {
    // Add click event listener to each button
    button.addEventListener('click', () => {
        // DATA ATTRIBUTE ACCESS - Get which tab to show
        // getAttribute reads the custom data-tab attribute from HTML
        const tabId = button.getAttribute('data-tab');
        
        // REMOVE ACTIVE STATE FROM ALL ELEMENTS
        // First, remove 'active' class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Then remove 'active' class from all content areas
        tabContents.forEach(content => content.classList.remove('active'));
        
        // ADD ACTIVE STATE TO CLICKED ELEMENTS
        // Add 'active' class to clicked button
        button.classList.add('active');
        // Add 'active' class to corresponding content area
        // Template literal used to create ID selector: "todo-app" or "github-app"
        document.getElementById(`${tabId}-app`).classList.add('active');
    });
});