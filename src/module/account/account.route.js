import { Router } from 'express';
import validate from 'express-validation';
import * as accountController from './account.controller';
import accountValidation from './account.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleNOTS, roleAccountant } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, roleNOTS, accountController.getAccountList);
routes.get('/:id', authJwt, roleNOTA, roleNOTS, accountController.getDetailAccount);
routes.post('/', authJwt, roleAccountant, validate(accountValidation.createAccount), accountController.createAccount);
routes.patch('/:id', authJwt, roleAccountant, validate(accountValidation.editAccount), accountController.updateAccount);
routes.delete('/:id', authJwt, roleAccountant, accountController.deleteAccount);

export default routes;
