import { Router } from 'express';
import validate from 'express-validation';
import * as receiptController from './receipt.controller';
import receiptValidation from './receipt.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleStaff } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, receiptController.getReceiptList);
routes.get('/:id', authJwt, roleNOTA, receiptController.getDetailReceipt);
routes.post('/', authJwt, roleStaff, validate(receiptValidation.createReceipt), receiptController.createReceipt);
routes.delete('/:id', authJwt, roleStaff, receiptController.deleteReceipt);

export default routes;
