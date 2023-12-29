const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const Employee = require('./EmployeeModel');

const app = express();

app.use(express.json());
app.use(cors());


let users = []

const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}



function authenticateUser(req, res, next) {
    if (req.session.authorization) {
        const token = req.session.authorization.accessToken;
        jwt.verify(token, 'access', (err, user) => {
            if (!err) {
                req.user = user;
                next();
            } else {
                return res.status(403).send('User not authenticated');
            }
        });
    } else {
        return res.status(403).send('User not logged in');
    }
}

app.use(session({ secret: "fingerpint" }, resave = true, saveUninitialized = true));

app.get('/api/users', (req, res) => {
    res.status(200).json(users);
});


app.post("/api/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).send("Error logging in");
    }
    const user = users.find((user) => user.username === username && user.password === password);
    if (user) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,
            username
        }
        req.session.isLoggedIn = true;
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).send("Invalid Login. Check username and password");
    }
});


app.post("/api/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).send("User successfully registred. Now you can login");
        } else {
            return res.status(404).send("User already exists!");
        }
    }
    return res.status(404).send("Unable to register user." );
});


app.post('/api/logout', (req, res) => {
    return res.status(200).send('User successfully logged out');
});



app.get('/api', (req, res) => {
    res.send('Welcome to Employees API!');
});

app.get('/api/employees', async (req, res) => {
    try {
        const employees = await Employee.find({});
        res.status(200).json(employees);
    } catch (error) {
        console.log('Error!' + error);
    }
});

app.get('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findOne({ id: id }, res.body);
        res.status(200).json(employee);
    } catch (error) {
        console.log('Error!' + error);
    }
});

app.post('/api/employees', async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(200).json(employee);
    } catch (error) {
        console.log('Error!' + error);
    }
});

app.put('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateEmployee = await Employee.findOneAndUpdate({ id: parseInt(id, 10) }, req.body, { new: true });
        if (!updateEmployee) {
            res.status(404).send("Cannot Find Employee with that ID")
        }
        res.status(200).json(updateEmployee);
    } catch (error) {
        console.log('Error!' + error);
    }
});



app.delete("/api/employees/", async (req, res) => {
    await Employee.deleteMany();
    res.status(200).send("All Employees Deleted Successfully!");
});


app.delete('/api/employees/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteEmployee = await Employee.findOneAndDelete({ id: id }, res.body);
        if (!deleteEmployee) {
            res.status(404).send("Cannot Find Employee with that ID");
        } else {
            res.status(200).send("Employee Successfully Deleted!");
        }
    } catch (error) {
        console.log('Error! ' + error);
    }
});



mongoose.connect('mongodb://localhost:27017/employees').then(async () => {
    console.log('Connected to Mongo DB!');
    app.listen(3000, () => {
        console.log('Running on port 3000!');
    });

}).catch(() => {
    console.log('Cannot Connect to MondoDB!');
});
