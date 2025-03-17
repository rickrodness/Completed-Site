/*
 * Extra Credit B: CRUD Actions (crud.js)
 * This script enables Create, Read, Update, and Delete operations 
 * on project data stored in localStorage.
 */

// Utility function: Retrieve project data from localStorage or return an empty array.
function getProjects() {
    return JSON.parse(localStorage.getItem('projectData')) || [];
  }
  
  // Utility function: Save the project array to localStorage.
  function saveProjects(projects) {
    localStorage.setItem('projectData', JSON.stringify(projects));
  }
  
  // Function to display the list of projects.
  function displayProjects() {
    const projects = getProjects();
    const list = document.getElementById('projects-list');
    list.innerHTML = ''; // Clear existing list items
    
    projects.forEach((project, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>${project.title}</strong> - ${project.description}
        <button onclick="editProject(${index})">Edit</button>
        <button onclick="deleteProject(${index})">Delete</button>
      `;
      list.appendChild(li);
    });
  }
  
  // Function to add a new project to localStorage.
  function addProject(project) {
    const projects = getProjects();
    projects.push(project);
    saveProjects(projects);
    displayProjects();
  }
  
  // Function to update an existing project.
  function updateProject(index, updatedProject) {
    const projects = getProjects();
    projects[index] = updatedProject;
    saveProjects(projects);
    displayProjects();
  }
  
  // Function to delete a project.
  function deleteProject(index) {
    const projects = getProjects();
    projects.splice(index, 1);
    saveProjects(projects);
    displayProjects();
  }
  
  // Function to load a project into the form for editing.
  function editProject(index) {
    const projects = getProjects();
    const project = projects[index];
    document.getElementById('project-index').value = index;
    document.getElementById('project-title').value = project.title;
    document.getElementById('project-image').value = project.image;
    document.getElementById('project-alt').value = project.alt;
    document.getElementById('project-description').value = project.description;
    document.getElementById('project-link').value = project.link;
    document.getElementById('submit-btn').textContent = 'Update Project';
  }
  
  // Event listener: Handle form submission for creating/updating a project.
  document.getElementById('crud-form').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting normally
    
    // Gather form data.
    const index = document.getElementById('project-index').value;
    const title = document.getElementById('project-title').value;
    const image = document.getElementById('project-image').value;
    const alt = document.getElementById('project-alt').value;
    const description = document.getElementById('project-description').value;
    const link = document.getElementById('project-link').value;
    
    const project = { title, image, alt, description, link };
  
    if (index === '') {
      // If no index, add a new project.
      addProject(project);
    } else {
      // Else, update the existing project.
      updateProject(parseInt(index, 10), project);
    }
    
    clearForm();
  });
  
  // Function to clear the form fields.
  function clearForm() {
    document.getElementById('project-index').value = '';
    document.getElementById('project-title').value = '';
    document.getElementById('project-image').value = '';
    document.getElementById('project-alt').value = '';
    document.getElementById('project-description').value = '';
    document.getElementById('project-link').value = '';
    document.getElementById('submit-btn').textContent = 'Add Project';
  }
  
  // Event listener for the Clear Form button.
  document.getElementById('clear-btn').addEventListener('click', clearForm);
  
  // Initialize the project list display on page load.
  displayProjects();
  
  // Expose editProject and deleteProject functions globally for inline event handlers.
  window.editProject = editProject;
  window.deleteProject = deleteProject;
  