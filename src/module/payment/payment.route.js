import { Router } from 'express';
import validate from 'express-validation';
import * as paymentController from './payment.controller';
import paymentValidation from './payment.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleStaff } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, paymentController.getPaymentList);
routes.get('/:id', authJwt, roleNOTA, paymentController.getDetailPayment);
routes.post('/', authJwt, roleStaff, validate(paymentValidation.createPayment), paymentController.createPayment);
routes.patch('/:id', authJwt, roleStaff, validate(paymentValidation.editPayment), paymentController.updatePayment);
routes.delete('/:id', authJwt, roleStaff, paymentController.deletePayment);

export default routes;
