let isLoggedIn = false;

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const usersResponse = await fetch('http://localhost:3000/api/users');
    const users = await usersResponse.json();
    const userExists = users.some(user => user.username === username);
    if (username === '' || password === '') {
        alert('Empty Field!');
    } else {
        if (userExists) {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            if (response.ok) {
                clearForm();
                isLoggedIn = true;
                showWelcomeMessage(username);
                loadEmployees();
            } else {
                alert('Invalid login credentials. Please try again.');
            }
        } else {
            alert('Username does not exist. Please register before logging in.');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }
    }
} 


async function register() {
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;
    const usersResponse = await fetch('http://localhost:3000/api/users');
    const users = await usersResponse.json();
    const isUsernameTaken = users.some(user => user.username === newUsername);
    if (newUsername === '' || newPassword === '') {
        alert('Empty Field!');
    }
    else {
        if (isUsernameTaken) {
            alert('Username already taken. Please choose a different username.');
        } else {
            const response = await fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: newUsername, password: newPassword }),
            });

            if (response.ok) {
                clearForm();
                alert('Registration successful. You can now log in.');
                showLoginForm();
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            } else {
                clearForm();
                alert('Failed to register. Please try again.');
                document.getElementById('username').value = '';
                document.getElementById('password').value = '';
            }
        }
    }
}

function showRegisterForm() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'block';
}

function showLoginForm() {
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'block';
}

function showWelcomeMessage(username) {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('register-container').style.display = 'none';
    document.getElementById('welcomeMessage').style.display = 'block';
    document.getElementById('welcomeMessage').innerHTML = `Welcome, ${username}!`;
    document.getElementById('employeeManagement').style.display = 'block';
}

async function logout() {
    const response = await fetch('http://localhost:3000/api/logout', {
        method: 'POST',
    });

    if (response.ok) {
        isLoggedIn = false;
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('welcomeMessage').style.display = 'none';
        document.getElementById('employeeManagement').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        alert('Failed to logout. Please try again.');
    }
    if(response.ok){
        alert('Logout Successfully!');
    }
}


async function addEmployee() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const salary = document.getElementById('salary').value;
    if (id === '' || name === '' || role === '' || salary === '') {
        alert('Empty Field!');
    } else {
        const response = await fetch('http://localhost:3000/api/employees', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, name, role, salary }),
        });

        if (response.ok) {
            clearForm();
            loadEmployees();
        } else {
            alert('Failed to add employee');
        }
    }
}


async function deleteEmployee(id) {
    const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        clearForm();
        loadEmployees();
    } else {
        alert('Failed to delete employee');
    }
}

function editEmployee(id, name, role, salary) {
    document.getElementById('id').value = id;
    document.getElementById('name').value = name;
    document.getElementById('role').value = role;
    document.getElementById('salary').value = salary;

    document.getElementById('saveBtn').style.display = 'inline-block';
}


async function saveEmployee() {
    const id = document.getElementById('id').value;
    const name = document.getElementById('name').value;
    const role = document.getElementById('role').value;
    const salary = document.getElementById('salary').value;

    const response = await fetch(`http://localhost:3000/api/employees/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, name, role, salary }),
    });

    if (response.ok) {
        loadEmployees();
    } else {
        alert('Failed to update employee');
    }
    document.getElementById('saveBtn').style.display = 'none';
    clearForm();
}


function clearForm() {
    document.getElementById('id').value = '';
    document.getElementById('name').value = '';
    document.getElementById('role').value = '';
    document.getElementById('salary').value = '';
}


async function loadEmployees() {
    const response = await fetch('http://localhost:3000/api/employees');
    const employees = await response.json();
    const tableBody = document.getElementById('employeeList');
    tableBody.innerHTML = '';

    employees.forEach(employee => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.role}</td>
                <td>${employee.salary}</td>
                <td>
                    <button onclick="editEmployee('${employee.id}', '${employee.name}', '${employee.role}', '${employee.salary}')">Edit</button>
                    <button onclick="deleteEmployee('${employee.id}')">Delete</button>
                </td>
            `;
        tableBody.appendChild(row);
    });
}

loadEmployees();
