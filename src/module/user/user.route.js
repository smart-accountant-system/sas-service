import validate from 'express-validation';
import { Router } from 'express';
import { getUserList, getUser, createUser, updateUser, deleteUser, authUser } from './user.controller';
import UserValidation from './user.validation';
import { authLocal, authJwt } from '../../service/passport';
import { OwnOrAdminManager, roleAdminManager } from './user.role';

const routes = new Router();

routes.get('/', authJwt, roleAdminManager, getUserList);
routes.get('/:id', authJwt, OwnOrAdminManager, getUser);

routes.post('/login', validate(UserValidation.login), authLocal, authUser);

routes.post('/', authJwt, roleAdminManager, validate(UserValidation.createUser), createUser);
routes.patch('/:id', authJwt, OwnOrAdminManager, validate(UserValidation.editProfile), updateUser);
routes.delete('/:id', authJwt, roleAdminManager, deleteUser);

export default routes;
