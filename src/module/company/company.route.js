import { Router } from 'express';
import validate from 'express-validation';
import * as companyController from './company.controller';
import companyValidation from './company.validation';
import { authJwt } from '../../service/passport';
import { roleAdmin } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleAdmin, companyController.getCompanyList);
routes.get('/:id', authJwt, companyController.getDetailCompany);
routes.post('/', authJwt, roleAdmin, validate(companyValidation.createCompany), companyController.createCompany);
routes.patch('/:id', authJwt, roleAdmin, validate(companyValidation.editCompany), companyController.updateCompany);
routes.delete('/:id', authJwt, roleAdmin, companyController.deleteCompany);

export default routes;
