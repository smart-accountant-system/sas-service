import HTTPStatus from 'http-status';
import constants from '../../config/constants';

export function OwnOrAdminManager(req, res, next) {
  if (req.user.role === constants.ROLE.SYSTEM_ADMIN || req.user.role === constants.ROLE.MANAGER || req.params.id === req.user._id.toString()) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}

export function roleAdminManager(req, res, next) {
  if (req.user.role === constants.ROLE.MANAGER || req.user.role === constants.ROLE.SYSTEM_ADMIN) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}
export function roleAdmin(req, res, next) {
  if (req.user.role === constants.ROLE.SYSTEM_ADMIN) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}

export function roleEmployee(req, res, next) {
  if (req.user.role === constants.ROLE.EMPLOYEE) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}