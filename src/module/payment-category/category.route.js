import { Router } from 'express';
import validate from 'express-validation';
import * as categoryController from './category.controller';
import categoryValidation from './category.validation';
import { authJwt } from '../../service/passport';
import { roleEmployee, notAdmin } from '../user/user.role';

const routes = new Router();

routes.get('/', authJwt, notAdmin, categoryController.getCategoryList);
routes.get('/:id', authJwt, notAdmin, categoryController.getDetailCategory);
routes.post('/', authJwt, notAdmin, validate(categoryValidation.createCategory), categoryController.createCategory);
routes.patch('/:id', authJwt, notAdmin, validate(categoryValidation.editCategory), categoryController.updateCategory);
routes.delete('/:id', authJwt, notAdmin, categoryController.deleteCategory);

export default routes;
