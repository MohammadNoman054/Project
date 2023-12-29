const EmployeeModel = require('./EmployeeModel');
const newEmployee = async (id,name,role,salary) => {
    let Employee = new EmployeeModel();
    Employee.id = id;
    Employee.name = name;
    Employee.role = role;
    Employee.salary = salary;
    await Employee.save();
    return Employee;
};

module.exports.newEmployee = newEmployee;