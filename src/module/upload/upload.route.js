import { Router } from 'express';
import validate from 'express-validation';
import * as uploadController from './upload.controller';
import { authJwt } from '../../service/passport';
import upload from '../../service/file';
import uploadValidation from './upload.validation';
import { roleAdmin } from '../../service/role';

const routes = new Router();

routes.get('/', authJwt, roleAdmin, uploadController.getListFile);
routes.get('/:filename', uploadController.getFile);
routes.post('/avatar', authJwt, upload.single('file'), validate(uploadValidation.upload), uploadController.upload);
// routes.post('/thumbnail', authJwt, roleAdmin, uploadController.generateThumbnail);
routes.delete('/:id', authJwt, uploadController.deleteFile);

export default routes;
