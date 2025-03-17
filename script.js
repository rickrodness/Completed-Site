/**********************************************
 * Part 1: CustomElement Creation (Project Cards)
 * Define a custom element <project-card> to display project info.
 **********************************************/
// placed at the top so it's available immediately.
class ProjectCard extends HTMLElement {
    constructor() {
        super();
        // shadow DOM to encapsulate styles 
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // retrieve attributes
        // default values are used if none provided
        const title = this.getAttribute('title') || 'Project Title';
        const image = this.getAttribute('img-src') || 'images/default.png';
        const alt = this.getAttribute('img-alt') || 'Default image';
        const description = this.getAttribute('description') || 'A short project description.';
        const link = this.getAttribute('link') || '#';

        // build the HTML custom element
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    margin: 1rem;
                    padding: 1rem;
                    border: 1px solid var(--primary-color, #1e90ff);
                    border-radius: 8px;
                    box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
                }
                h2 { margin-top: 0; }
                picture, img {
                    width: 100%;
                    border-radius: 4px;
                }
                a {
                    text-decoration: none;
                    color: var(--primary-color, #1e90ff);
                }
            </style>
            <article>
                <h2>${title}</h2>
                <picture>
                    <img src="${image}" alt="${alt}">
                </picture>
                <p>${description}</p>
                <a href="${link}">Learn more</a>
            </article>
        `;
    }
}
customElements.define('project-card', ProjectCard);


 // Main Script

document.addEventListener("DOMContentLoaded", function () {
    // Dark Mode
    const themeToggle = document.getElementById("theme-toggle");

    function setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);

        if (themeToggle) {
            // Switch icon based on theme
            themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener("click", function () {
            const currentTheme = document.documentElement.dataset.theme;
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            setTheme(newTheme);
        });
    }

    // Load saved theme (dark/light) from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    /* ======================================
       2) Theme Customizer 
       ====================================== */
    // Elements from the Theme Customizer section
    const customThemeNameInput = document.getElementById("customThemeName");
    const customTextColorInput = document.getElementById("customTextColor");
    const customBgColorInput = document.getElementById("customBgColor");
    const customFontSelect = document.getElementById("customFontSelect");
    const applyCustomThemeBtn = document.getElementById("applyCustomTheme");
    const saveCustomThemeBtn = document.getElementById("saveCustomTheme");
    const loadCustomThemeBtn = document.getElementById("loadCustomTheme");

    // Function to apply the custom theme by updating CSS variables
    function applyCustomTheme(themeName, textColor, bgColor, fontFamily) {
        document.documentElement.style.setProperty('--text-color', textColor);
        document.documentElement.style.setProperty('--background-color', bgColor);
        document.documentElement.style.setProperty('--font-family', fontFamily);

        // Optionally set a data-theme attribute
        document.documentElement.dataset.theme = themeName || 'custom';
    }

    // Apply button: immediately apply the chosen colors/font to the page
    if (applyCustomThemeBtn) {
        applyCustomThemeBtn.addEventListener('click', () => {
            const themeName = customThemeNameInput.value.trim() || 'custom';
            const textColor = customTextColorInput.value;
            const bgColor = customBgColorInput.value;
            const fontFamily = customFontSelect.value;

            applyCustomTheme(themeName, textColor, bgColor, fontFamily);
        });
    }

    // Save button: store the custom theme in localStorage
    if (saveCustomThemeBtn) {
        saveCustomThemeBtn.addEventListener('click', () => {
            const themeName = customThemeNameInput.value.trim() || 'custom';
            const textColor = customTextColorInput.value;
            const bgColor = customBgColorInput.value;
            const fontFamily = customFontSelect.value;

            const customTheme = {
                themeName,
                textColor,
                bgColor,
                fontFamily
            };
            localStorage.setItem("customTheme", JSON.stringify(customTheme));
            alert("Custom theme saved!");
        });
    }

    // Load button: retrieve the custom theme from localStorage and apply it
    if (loadCustomThemeBtn) {
        loadCustomThemeBtn.addEventListener('click', () => {
            const saved = localStorage.getItem("customTheme");
            if (saved) {
                const customTheme = JSON.parse(saved);

                // Populate the inputs
                customThemeNameInput.value = customTheme.themeName;
                customTextColorInput.value = customTheme.textColor;
                customBgColorInput.value = customTheme.bgColor;
                customFontSelect.value = customTheme.fontFamily;

                // Apply it to the page
                applyCustomTheme(
                    customTheme.themeName,
                    customTheme.textColor,
                    customTheme.bgColor,
                    customTheme.fontFamily
                );
            } else {
                alert("No custom theme found in localStorage!");
            }
        });
    }

    /* ======================================
       3) Contact Form Validation & Submission
       ====================================== */
    const form = document.getElementById("contactForm");
    if (form) {
        const nameInput = document.getElementById("name");
        const emailInput = document.getElementById("email");
        const messageInput = document.getElementById("message");
        const charCountOutput = document.getElementById("charCount");
        const formErrorsField = document.getElementById("formErrors");
        const errorMsg = document.getElementById("errorMsg");
        const infoMsg = document.getElementById("infoMsg");
        let formErrors = [];

        // Character countdown for textarea
        if (messageInput && charCountOutput) {
            messageInput.addEventListener("input", function () {
                const remaining = 500 - messageInput.value.length;
                charCountOutput.textContent = `${remaining} characters left`;
                charCountOutput.style.color = remaining <= 50 ? "red" : "black";
            });
        }

        // Validation function that returns an error message if invalid
        function validateField(input, pattern) {
            if (!input.value.match(pattern)) {
                let msg = `Invalid input: ${input.placeholder}`;
                formErrors.push({ field: input.name, message: msg });
                return msg;
            }
            return "";
        }

        // Production Version: Prevent submission if there are errors
        form.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            formErrors = [];
            errorMsg.textContent = "";
            infoMsg.textContent = "";

            let errName = validateField(nameInput, /^[A-Za-z\s]+$/);
            let errEmail = validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);

            if (errName || errEmail) {
                errorMsg.textContent = errName + " " + errEmail;
                formErrorsField.value = JSON.stringify(formErrors);
                return; // Stop submission if errors exist
            }

            // Send the form data via fetch()
            const formData = new FormData(form);
            fetch("https://httpbin.org/post", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                infoMsg.textContent = "✅ Message successfully sent!";
                form.reset(); // Clear form after submission
                charCountOutput.textContent = "500 characters left";
            })
            .catch(error => {
                errorMsg.textContent = "❌ An error occurred. Please try again.";
            });
        });
    }

    /* =====================================================
       Parts 1 & 2: Project Cards & Data Loading 
       ===================================================== */
    // Function to populate the cards container with project data.
    function populateCards(dataArray) {
        const container = document.getElementById('cards-container');
        if (!container) return;
        container.innerHTML = '';  // Clear previous cards
        dataArray.forEach(project => {
            const card = document.createElement('project-card');
            // Set attributes based on the JSON data.
            card.setAttribute('title', project.title);
            card.setAttribute('img-src', project.image);
            card.setAttribute('img-alt', project.alt);
            card.setAttribute('description', project.description);
            card.setAttribute('link', project.link);
            container.appendChild(card);
        });
    }

    // Event listener for "Load Local" button.
    const loadLocalBtn = document.getElementById('load-local');
    if (loadLocalBtn) {
        loadLocalBtn.addEventListener('click', () => {
            // Retrieve project data from localStorage; default to an empty array if none exists.
            const data = JSON.parse(localStorage.getItem('projectData')) || [];
            populateCards(data);
        });
    }

    // Event listener for "Load Remote" button.
    const loadRemoteBtn = document.getElementById('load-remote');
    if (loadRemoteBtn) {
        loadRemoteBtn.addEventListener('click', async () => {
            try {
                // Replace the URL below with your remote JSON endpoint.
                const response = await fetch('https://my-json-server.typicode.com/yourRepo/project-data');
                const data = await response.json();
                populateCards(data);
            } catch (error) {
                console.error("Error loading remote data:", error);
            }
        });
    }

}); 
