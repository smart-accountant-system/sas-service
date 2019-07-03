import { Router } from 'express';
import validate from 'express-validation';
import registerValidation from './register.validation';
import * as registerController from './register.controller';


const routes = new Router();

routes.post('/', validate(registerValidation.register), registerController.doRegister);

export default routes;
