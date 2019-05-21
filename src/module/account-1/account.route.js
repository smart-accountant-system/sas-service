import { Router } from 'express';
import validate from 'express-validation';
import * as accountController from './account.controller';
import accountValidation from './account.validation';
import { authJwt } from '../../service/passport';
import { roleAdmin } from '../user/user.role';

const routes = new Router();

routes.get('/', authJwt, roleAdmin, accountController.getAccountList);
routes.get('/:id', authJwt, accountController.getDetailAccount);
routes.post('/', authJwt, roleAdmin, validate(accountValidation.createAccount), accountController.createAccount);
routes.patch('/:id', authJwt, roleAdmin, validate(accountValidation.editAccount), accountController.updateAccount);
routes.delete('/:id', authJwt, roleAdmin, accountController.deleteAccount);

export default routes;
