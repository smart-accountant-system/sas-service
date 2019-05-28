import { Router } from 'express';
import validate from 'express-validation';
import * as paymentController from './payment.controller';
import paymentValidation from './payment.validation';
import { authJwt } from '../../service/passport';
import { roleEmployee, notAdmin } from '../user/user.role';

const routes = new Router();

routes.get('/', authJwt, notAdmin, paymentController.getPaymentList);
routes.get('/:id', authJwt, notAdmin, paymentController.getDetailPayment);
routes.post('/', authJwt, roleEmployee, validate(paymentValidation.createPayment), paymentController.createPayment);

// After create so cant change payment
// routes.patch('/:id', authJwt, roleEmployee, validate(paymentValidation.editPayment), paymentController.updatePayment);

routes.delete('/:id', authJwt, roleEmployee, paymentController.deletePayment);

export default routes;
