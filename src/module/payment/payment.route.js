import { Router } from 'express';
import validate from 'express-validation';
import * as paymentController from './payment.controller';
import paymentValidation from './payment.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleEmployee } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, paymentController.getPaymentList);
routes.get('/:id', authJwt, roleNOTA, paymentController.getDetailPayment);
routes.post('/', authJwt, roleEmployee, validate(paymentValidation.createPayment), paymentController.createPayment);
routes.patch('/:id', authJwt, roleEmployee, validate(paymentValidation.editPayment), paymentController.updatePayment);
routes.delete('/:id', authJwt, roleEmployee, paymentController.deletePayment);

export default routes;
