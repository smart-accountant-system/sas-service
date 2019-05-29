import { Router } from 'express';
import validate from 'express-validation';
import * as invoiceController from './invoice.controller';
import invoiceValidation from './invoice.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleStaff } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, invoiceController.getInvoiceList);
routes.get('/:id', authJwt, roleNOTA, invoiceController.getDetailInvoice);
routes.post('/', authJwt, roleStaff, validate(invoiceValidation.createInvoice), invoiceController.createInvoice);
routes.patch('/:id', authJwt, roleStaff, validate(invoiceValidation.editInvoice), invoiceController.updateInvoice);
routes.delete('/:id', authJwt, roleStaff, invoiceController.deleteInvoice);

export default routes;
