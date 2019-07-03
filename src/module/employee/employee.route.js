import validate from 'express-validation';
import { Router } from 'express';
import { getEmployeeList, getEmployee, createEmployee, updateEmployee, deleteEmployee, 
  sendConfirmMail, sendResetPasswordMail, resetPassword, confirmEmployee } from './employee.controller';
import EmployeeValidation from './employee.validation';
import { authLocal, authJwt } from '../../service/passport';
import { roleAM, roleNOTO, roleAMO } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleAM, getEmployeeList);
routes.get('/:id', authJwt, roleAMO, getEmployee);
routes.delete('/:id', authJwt, roleNOTO, roleAM, deleteEmployee);

routes.get('/rspw/send-email/:username', sendResetPasswordMail);
routes.post('/rspw/:token', authJwt, validate(EmployeeValidation.editPassword), resetPassword);

routes.get('/confirm/resend-email/:username', sendConfirmMail);
routes.get('/confirm/:token', authJwt, confirmEmployee);

routes.post('/login', validate(EmployeeValidation.login), authLocal);
routes.post('/', authJwt, roleAM, validate(EmployeeValidation.createEmployee), createEmployee);

// Reset pw by manager & update profile now use 2 below route
routes.patch('/:id', authJwt, roleAMO, validate(EmployeeValidation.editProfile), updateEmployee); 
routes.patch('/editPW/:id', authJwt, roleAMO, validate(EmployeeValidation.editPassword), updateEmployee);


export default routes;
