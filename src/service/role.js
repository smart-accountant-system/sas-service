import HTTPStatus from 'http-status';
import constants from '../config/constants';



export function roleAdmin(req, res, next) {
    if (!req.user.role) {
      return next();
    }
    return res.sendStatus(HTTPStatus.FORBIDDEN);
  }
  

// AM: Admin or manager
export function roleAM(req, res, next) {
  if (!req.user.role || req.user.role == constants.ROLE.MANAGER) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}

// AMO: Admin, manager or own
export function roleAMO(req, res, next) {
  if (!req.user.role || req.user.role == constants.ROLE.MANAGER || req.user._id == req.params.id) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}
