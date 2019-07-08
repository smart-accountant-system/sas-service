import validate from 'express-validation';
import { Router } from 'express';
import multer from 'multer';
import { getAdminList, getAdmin, createAdmin, updateAdmin, deleteAdmin, uploadAvatar, getAvatar, deleteAvatar } from './admin.controller';
import adminValidation from './admin.validation';
import { authLocal, authJwt } from '../../service/passport';
import { roleAdmin } from '../../service/role';

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image'));
    }

    cb(undefined, true);
  },
});

const routes = new Router();

routes.get('/', authJwt, roleAdmin, getAdminList);
routes.get('/:id', authJwt, roleAdmin, getAdmin);
routes.get('/:id/avatar', getAvatar);
routes.post('/login', validate(adminValidation.login), authLocal);
routes.post('/', authJwt, roleAdmin, validate(adminValidation.createAdmin), createAdmin);
routes.post('/:id/avatar', authJwt, roleAdmin, upload.single('avatar'), uploadAvatar);
routes.patch('/:id', authJwt, roleAdmin, validate(adminValidation.editProfile), updateAdmin);
routes.delete('/:id', authJwt, roleAdmin, deleteAdmin);
routes.delete('/:id/avatar', authJwt, roleAdmin, deleteAvatar);

export default routes;
