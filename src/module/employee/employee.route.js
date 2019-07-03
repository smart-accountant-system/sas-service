import validate from 'express-validation';
import { Router } from 'express';
import { getEmployeeList, getEmployee, createEmployee, updateEmployee, deleteEmployee, 
  sendConfirmMail, confirmEmployee } from './employee.controller';
import EmployeeValidation from './employee.validation';
import { authLocal, authJwt } from '../../service/passport';
import { roleAM, roleNOTO, roleAMO, roleOwn } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleAM, getEmployeeList);
routes.get('/:id', authJwt, roleAMO, getEmployee);
routes.delete('/:id', authJwt, roleNOTO, roleAM, deleteEmployee);

routes.get('/confirm/resend-email/:username', sendConfirmMail);
routes.get('/confirm/:token', authJwt, confirmEmployee);

routes.post('/login', validate(EmployeeValidation.login), authLocal);
routes.post('/', authJwt, roleAM, validate(EmployeeValidation.createEmployee), createEmployee);

// Reset pw by manager & update profile now use this route
routes.patch('/:id', authJwt, roleAMO, validate(EmployeeValidation.editProfile), updateEmployee); 

// Change password by own now use this route
routes.patch('/editPW/:id', authJwt, roleOwn, validate(EmployeeValidation.editPassword), updateEmployee);


export default routes;
