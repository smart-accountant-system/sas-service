import { Router } from 'express';
import validate from 'express-validation';
import * as customerController from './customer.controller';
import customerValidation from './customer.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleStaff } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, customerController.getCustomerList);
routes.get('/:id', authJwt, roleNOTA, customerController.getDetailCustomer);
routes.post('/', authJwt, roleStaff, validate(customerValidation.createCustomer), customerController.createCustomer);
routes.patch('/:id', authJwt, roleStaff, validate(customerValidation.editCustomer), customerController.updateCustomer);
routes.delete('/:id', authJwt, roleStaff, customerController.deleteCustomer);

export default routes;
