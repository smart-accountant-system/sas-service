import { Router } from 'express';
import validate from 'express-validation';
import * as transactionController from './transaction.controller';
import transactionValidation from './transaction.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleNOTS, roleAccountant } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, roleNOTS, transactionController.getTransactionList);
routes.get('/:id', authJwt, roleNOTA, roleNOTS, transactionController.getDetailTransaction);
routes.post('/', authJwt, roleAccountant, validate(transactionValidation.createTransaction), transactionController.createTransaction);
routes.delete('/:id', authJwt, roleAccountant, transactionController.deleteTransaction);

export default routes;
