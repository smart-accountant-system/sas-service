import validate from 'express-validation';
import { Router } from 'express';
import { getEmployeeList, getEmployee, createEmployee, updateEmployee, deleteEmployee, authEmployee } from './employee.controller';
import EmployeeValidation from './employee.validation';
import { authLocal, authJwt } from '../../service/passport';
import { roleAM, roleNOTO, roleAMO, roleOwn, roleManager } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleAM, getEmployeeList);
routes.get('/:id', authJwt, roleAMO, getEmployee);
routes.post('/login', validate(EmployeeValidation.login), authLocal, authEmployee);
routes.post('/', authJwt, roleAM, validate(EmployeeValidation.createEmployee), createEmployee);
routes.patch('/:id', authJwt, roleAMO, validate(EmployeeValidation.editProfile), updateEmployee);
routes.patch('/editPW/:id', authJwt, roleOwn, validate(EmployeeValidation.editPassword), updateEmployee);
routes.patch('/resetPW/:id', authJwt, roleManager, validate(EmployeeValidation.editPassword), updateEmployee);
routes.delete('/:id', authJwt, roleNOTO, roleAM, deleteEmployee);

export default routes;
