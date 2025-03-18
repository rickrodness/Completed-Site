/**********************************************
 * Part 1: CustomElement Creation (Project Cards)
 **********************************************/
class ProjectCard extends HTMLElement {
    constructor() {
        super();
        // Shadow DOM to encapsulate styles
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Retrieve attributes with default values if not provided
        const title = this.getAttribute('title') || 'Project Title';
        const image = this.getAttribute('img-src') || 'images/default.png';
        const alt = this.getAttribute('img-alt') || 'Default image';
        const description = this.getAttribute('description') || 'A short project description.';
        const link = this.getAttribute('link') || '#';

        // Build the custom element HTML
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

/**********************************************
 * Main Script
 **********************************************/
document.addEventListener("DOMContentLoaded", function () {
    // Dark Mode Functionality
    const themeToggle = document.getElementById("theme-toggle");
    function setTheme(theme) {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("theme", theme);
        if (themeToggle) {
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
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);

    // Hamburger Menu Toggle Functionality
    const hamburger = document.getElementById("hamburger");
    const nav = document.querySelector("nav");
    if (hamburger) {
        hamburger.addEventListener("click", function () {
            nav.classList.toggle("active");
        });
    }

    /* ======================================
       2) Theme Customizer 
       ====================================== */
    const customThemeNameInput = document.getElementById("customThemeName");
    const customTextColorInput = document.getElementById("customTextColor");
    const customBgColorInput = document.getElementById("customBgColor");
    const customFontSelect = document.getElementById("customFontSelect");
    const applyCustomThemeBtn = document.getElementById("applyCustomTheme");
    const saveCustomThemeBtn = document.getElementById("saveCustomTheme");
    const loadCustomThemeBtn = document.getElementById("loadCustomTheme");

    function applyCustomTheme(themeName, textColor, bgColor, fontFamily) {
        document.documentElement.style.setProperty('--text-color', textColor);
        document.documentElement.style.setProperty('--background-color', bgColor);
        document.documentElement.style.setProperty('--font-family', fontFamily);
        document.documentElement.dataset.theme = themeName || 'custom';
    }

    if (applyCustomThemeBtn) {
        applyCustomThemeBtn.addEventListener('click', () => {
            const themeName = customThemeNameInput.value.trim() || 'custom';
            const textColor = customTextColorInput.value;
            const bgColor = customBgColorInput.value;
            const fontFamily = customFontSelect.value;
            applyCustomTheme(themeName, textColor, bgColor, fontFamily);
        });
    }

    if (saveCustomThemeBtn) {
        saveCustomThemeBtn.addEventListener('click', () => {
            const themeName = customThemeNameInput.value.trim() || 'custom';
            const textColor = customTextColorInput.value;
            const bgColor = customBgColorInput.value;
            const fontFamily = customFontSelect.value;
            const customTheme = { themeName, textColor, bgColor, fontFamily };
            localStorage.setItem("customTheme", JSON.stringify(customTheme));
            alert("Custom theme saved!");
        });
    }

    if (loadCustomThemeBtn) {
        loadCustomThemeBtn.addEventListener('click', () => {
            const saved = localStorage.getItem("customTheme");
            if (saved) {
                const customTheme = JSON.parse(saved);
                customThemeNameInput.value = customTheme.themeName;
                customTextColorInput.value = customTheme.textColor;
                customBgColorInput.value = customTheme.bgColor;
                customFontSelect.value = customTheme.fontFamily;
                applyCustomTheme(customTheme.themeName, customTheme.textColor, customTheme.bgColor, customTheme.fontFamily);
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

        if (messageInput && charCountOutput) {
            messageInput.addEventListener("input", function () {
                const remaining = 500 - messageInput.value.length;
                charCountOutput.textContent = `${remaining} characters left`;
                charCountOutput.style.color = remaining <= 50 ? "red" : "black";
            });
        }

        function validateField(input, pattern) {
            if (!input.value.match(pattern)) {
                let msg = `Invalid input: ${input.placeholder}`;
                formErrors.push({ field: input.name, message: msg });
                return msg;
            }
            return "";
        }

        form.addEventListener("submit", function (event) {
            event.preventDefault();
            formErrors = [];
            errorMsg.textContent = "";
            infoMsg.textContent = "";

            let errName = validateField(nameInput, /^[A-Za-z\s]+$/);
            let errEmail = validateField(emailInput, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);

            if (errName || errEmail) {
                errorMsg.textContent = errName + " " + errEmail;
                formErrorsField.value = JSON.stringify(formErrors);
                return;
            }

            const formData = new FormData(form);
            fetch("https://httpbin.org/post", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                infoMsg.textContent = "✅ Message successfully sent!";
                form.reset();
                charCountOutput.textContent = "500 characters left";
            })
            .catch(error => {
                errorMsg.textContent = "❌ An error occurred. Please try again.";
            });
        });
    }

    /* ======================================
       4) Project Cards & Data Loading 
       ====================================== */
    function populateCards(dataArray) {
        const container = document.getElementById('cards-container');
        if (!container) return;
        container.innerHTML = '';
        dataArray.forEach(project => {
            const card = document.createElement('project-card');
            card.setAttribute('title', project.title);
            card.setAttribute('img-src', project.image);
            card.setAttribute('img-alt', project.alt);
            card.setAttribute('description', project.description);
            card.setAttribute('link', project.link);
            container.appendChild(card);
        });
    }

    const loadLocalBtn = document.getElementById('load-local');
    if (loadLocalBtn) {
        loadLocalBtn.addEventListener('click', () => {
            const data = JSON.parse(localStorage.getItem('projectData')) || [];
            populateCards(data);
        });
    }

    const loadRemoteBtn = document.getElementById('load-remote');
    if (loadRemoteBtn) {
        loadRemoteBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('https://my-json-server.typicode.com/yourRepo/project-data');
                const data = await response.json();
                populateCards(data);
            } catch (error) {
                console.error("Error loading remote data:", error);
            }
        });
    }
});
