import { Router } from 'express';
import validate from 'express-validation';
import * as categoryController from './category.controller';
import categoryValidation from './category.validation';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleManager } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, categoryController.getCategoryList);
routes.get('/:id', authJwt, roleNOTA, categoryController.getDetailCategory);
routes.post('/', authJwt, roleNOTA, roleManager, validate(categoryValidation.createCategory), categoryController.createCategory);
routes.patch('/:id', authJwt, roleNOTA, roleManager, validate(categoryValidation.editCategory), categoryController.updateCategory);
routes.delete('/:id', authJwt, roleNOTA, roleManager, categoryController.deleteCategory);

export default routes;
