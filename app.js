// app.js
// Obsługa przycisków i formularzy

document.addEventListener("DOMContentLoaded", function() {
    const ctaButtons = document.querySelectorAll(".cta-button");
    let users = JSON.parse(localStorage.getItem("users")) || [];

    ctaButtons.forEach(button => {
        button.addEventListener("click", function() {
            if (button.textContent === "Wypróbuj za darmo") {
                window.location.href = "register.html";
            } else if (button.textContent === "Zaloguj się") {
                window.location.href = "login.html";
            }
        });
    });

    // Logowanie użytkownika
    const loginForm = document.querySelector("#login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.querySelector("#login-email").value;
            const password = document.querySelector("#login-password").value;
            const user = users.find(user => user.email === email && user.password === password);
            if (user) {
                alert("Logowanie udane!");
                localStorage.setItem("loggedInUser", JSON.stringify(user));
                window.location.href = "dashboard.html";
            } else {
                alert("Niepoprawne dane logowania. Spróbuj ponownie.");
            }
        });
    }

    // Rejestracja użytkownika
    const registerForm = document.querySelector("#register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const email = document.querySelector("#register-username").value;
            const password = document.querySelector("#register-password").value;
            const confirmPassword = document.querySelector("#register-confirm-password").value;
            const name = document.querySelector("#register-name").value;
            const surname = document.querySelector("#register-surname").value;
            const phone = document.querySelector("#register-phone").value;

            // Sprawdzenie, czy hasła są takie same
            if (password !== confirmPassword) {
                alert("Hasła muszą się zgadzać.");
                return;
            }

            // Sprawdzenie, czy użytkownik już istnieje
            const userExists = users.some(user => user.email === email);
            if (userExists) {
                alert("Użytkownik o podanym adresie e-mail już istnieje.");
                return;
            }

            // Zapisanie danych użytkownika i przekierowanie tylko w przypadku poprawności danych
            const newUser = {
                name: name,
                surname: surname,
                phone: phone,
                email: email,
                password: password,
                tasks: [],
                recommendations: []
            };
            users.push(newUser);
            localStorage.setItem("users", JSON.stringify(users));
            alert("Rejestracja udana!");
            window.location.href = "login.html";
        });
    }

    // Dodawanie nowego zadania
    const addTaskBtn = document.querySelector("#add-task-btn");
    if (addTaskBtn) {
        addTaskBtn.addEventListener("click", function() {
            let loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            if (loggedInUser) {
                const newTaskTitle = prompt("Podaj tytuł nowego zadania:");
                if (newTaskTitle) {
                    const newTask = {
                        title: newTaskTitle,
                        dueDate: new Date().toLocaleDateString()
                    };
                    loggedInUser.tasks.push(newTask);
                    users = users.map(user => user.email === loggedInUser.email ? loggedInUser : user);
                    localStorage.setItem("users", JSON.stringify(users));
                    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));

                    // Aktualizacja listy zadań
                    loadUserTasks(loggedInUser);
                }
            } else {
                alert("Musisz być zalogowany, aby dodać zadanie.");
            }
        });
    }

    // Wylogowanie użytkownika
    const logoutLink = document.querySelector("#logout-link");
    if (logoutLink) {
        logoutLink.addEventListener("click", function() {
            localStorage.removeItem("loggedInUser");
            window.location.href = "login.html";
        });
    }

    // Załadowanie zadań użytkownika na dashboardzie
    document.addEventListener("DOMContentLoaded", function() {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (window.location.pathname.includes("dashboard.html") && !loggedInUser) {
            window.location.href = "login.html";
        }
        if (loggedInUser && document.getElementById("user-name")) {
            document.getElementById("user-name").textContent = loggedInUser.name;
            loadUserTasks(loggedInUser);
            loadUserRecommendations(loggedInUser);
        }
    });
});

// Funkcje pomocnicze do ładowania danych użytkownika
function loadUserTasks(user) {
    const tasksList = document.getElementById("tasks-list");
    tasksList.innerHTML = "";
    if (user.tasks && user.tasks.length > 0) {
        user.tasks.forEach(task => {
            const taskItem = document.createElement("div");
            taskItem.classList.add("task-item");
            taskItem.innerHTML = `<h3>${task.title}</h3><p>Termin: ${task.dueDate}</p>`;
            tasksList.appendChild(taskItem);
        });
    }
}

function loadUserRecommendations(user) {
    const recommendationsList = document.getElementById("recommendations-list");
    recommendationsList.innerHTML = "";
    if (user.recommendations && user.recommendations.length > 0) {
        user.recommendations.forEach(recommendation => {
            const recommendationItem = document.createElement("li");
            recommendationItem.textContent = recommendation;
            recommendationsList.appendChild(recommendationItem);
        });
    }
}
