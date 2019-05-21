import { Router } from 'express';
import validate from 'express-validation';
import * as customerController from './customer.controller';
import customerValidation from './customer.validation';
import { authJwt } from '../../service/passport';
import { notAdmin, roleManager, roleManagerEmployee } from '../user/user.role';

const routes = new Router();

routes.get('/', authJwt, notAdmin, customerController.getCustomerList);
routes.get('/:id', authJwt, notAdmin, customerController.getDetailCustomer);
routes.post('/', authJwt, roleManagerEmployee, validate(customerValidation.createCustomer), customerController.createCustomer);
routes.patch('/:id', authJwt, roleManagerEmployee, validate(customerValidation.editCustomer), customerController.updateCustomer);
routes.delete('/:id', authJwt, roleManager, customerController.deleteCustomer);

export default routes;
