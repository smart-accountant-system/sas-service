import HTTPStatus from 'http-status';
import constants from '../../config/constants';



// -----------------------------------------------------------
// -------------------------SINGLE----------------------------
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

export function roleAccountant(req, res, next) {
  if (req.user.role === constants.ROLE.ACCOUNTANT) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}

export function roleManager(req, res, next) {
  if (req.user.role === constants.ROLE.MANAGER) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}
// ---------------------END OF SINGLE-------------------------
// -----------------------------------------------------------



// -----------------------------------------------------------
// -------------------------MULTIPLE--------------------------
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

export function roleManagerEmployee(req, res, next) {
  if (req.user.role === constants.ROLE.MANAGER || req.user.role === constants.ROLE.EMPLOYEE) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}
// ---------------------END OF MULTIPLE-----------------------
// -----------------------------------------------------------



// -----------------------------------------------------------
// ------------------------REVERSE----------------------------
export function notAdmin(req, res, next) {
  if (req.user.role !== constants.ROLE.SYSTEM_ADMIN) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}
export function notEmployee(req, res, next) {
  if (req.user.role !== constants.ROLE.EMPLOYEE) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}
// ---------------------END OF REVERSE------------------------
// -----------------------------------------------------------