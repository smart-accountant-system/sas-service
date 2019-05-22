import { Router } from 'express';
import validate from 'express-validation';
import * as transactionController from './transaction.controller';
import transactionValidation from './transaction.validation';
import { authJwt } from '../../service/passport';
import { notAdmin, notEmployee, roleAccountant } from '../user/user.role';

const routes = new Router();

routes.get('/', authJwt, notAdmin, notEmployee, transactionController.getTransactionList);
routes.get('/:id', authJwt, notAdmin, notEmployee, transactionController.getDetailTransaction);
routes.post('/', authJwt, roleAccountant, validate(transactionValidation.createTransaction), transactionController.createTransaction);

// After create so cant change transaction
// routes.patch('/:id', authJwt, roleEmployee, validate(transactionValidation.editTransaction), transactionController.updateTransaction);

routes.delete('/:id', authJwt, roleAccountant, transactionController.deleteTransaction);

export default routes;
