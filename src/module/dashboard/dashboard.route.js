import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { authJwt } from '../../service/passport';
import { roleNOTA, roleNOTS } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleNOTA, roleNOTS, dashboardController.getDashboard);

export default routes;
