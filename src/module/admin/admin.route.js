import validate from 'express-validation';
import { Router } from 'express';
import { getAdminList, getAdmin, createAdmin, updateAdmin, deleteAdmin } from './admin.controller';
import adminValidation from './admin.validation';
import { authLocal, authJwt } from '../../service/passport';
import { roleAdmin } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleAdmin, getAdminList);
routes.get('/:id', authJwt, roleAdmin, getAdmin);
routes.post('/login', validate(adminValidation.login), authLocal);
routes.post('/', authJwt, roleAdmin, validate(adminValidation.createAdmin), createAdmin);
routes.patch('/:id', authJwt, roleAdmin, validate(adminValidation.editProfile), updateAdmin);
routes.delete('/:id', authJwt, roleAdmin, deleteAdmin);

export default routes;
