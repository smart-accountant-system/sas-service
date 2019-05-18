import validate from 'express-validation';
import { Router } from 'express';
import { getUserList, getUser, createUser, updateUser, deleteUser, authUser } from './user.controller';
import UserValidation from './user.validation';
import { authLocal, authJwt } from '../../service/passport';
import { OwnOrAdmin, roleAdminManager } from './user.role';

const routes = new Router();

routes.get('/', authJwt, getUserList);
routes.get('/:id', authJwt, getUser);

routes.post('/login', validate(UserValidation.login), authLocal, authUser);

routes.post('/', createUser);
routes.patch('/:id', authJwt, OwnOrAdmin, validate(UserValidation.editProfile), updateUser);
routes.delete('/:id', authJwt, roleAdminManager, deleteUser);

export default routes;
