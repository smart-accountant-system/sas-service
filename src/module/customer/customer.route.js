import { Router } from 'express';
import validate from 'express-validation';
import * as customerController from './customer.controller';
import customerValidation from './customer.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleNOTA2 } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, customerController.getCustomerList);
routes.get('/:id', authJwt, roleNOTA, customerController.getDetailCustomer);
routes.post('/', authJwt, roleNOTA2, validate(customerValidation.createCustomer), customerController.createCustomer);
routes.patch('/:id', authJwt, roleNOTA2, validate(customerValidation.editCustomer), customerController.updateCustomer);
routes.delete('/:id', authJwt, roleNOTA2, customerController.deleteCustomer);

export default routes;
