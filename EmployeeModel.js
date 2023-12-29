const mongoose = require('mongoose');

const EmployeeSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
        },
        name: String,
        role: String,
        salary: Number
    }
);

const Employee = mongoose.model('Employee',EmployeeSchema);

module.exports = Employee;