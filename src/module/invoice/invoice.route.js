import { Router } from 'express';
import validate from 'express-validation';
import * as invoiceController from './invoice.controller';
import invoiceValidation from './invoice.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleEmployee } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, invoiceController.getInvoiceList);
routes.get('/:id', authJwt, roleNOTA, invoiceController.getDetailInvoice);
routes.post('/', authJwt, roleEmployee, validate(invoiceValidation.createInvoice), invoiceController.createInvoice);
routes.patch('/:id', authJwt, roleEmployee, validate(invoiceValidation.editInvoice), invoiceController.updateInvoice);
routes.delete('/:id', authJwt, roleEmployee, invoiceController.deleteInvoice);

export default routes;
