import { Router } from 'express';
import validate from 'express-validation';
import * as invoiceController from './invoice.controller';
import invoiceValidation from './invoice.validation';
import { authJwt } from '../../service/passport';
import { roleEmployee, notAdmin } from '../user/user.role';

const routes = new Router();

routes.get('/', authJwt, notAdmin, invoiceController.getInvoiceList);
routes.get('/:id', authJwt, notAdmin, invoiceController.getDetailInvoice);
routes.post('/', authJwt, roleEmployee, validate(invoiceValidation.createInvoice), invoiceController.createInvoice);

// After create so cant change invoice
// routes.patch('/:id', authJwt, roleEmployee, validate(invoiceValidation.editInvoice), invoiceController.updateInvoice);

routes.delete('/:id', authJwt, roleEmployee, invoiceController.deleteInvoice);

export default routes;
