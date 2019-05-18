import HTTPStatus from 'http-status';

export function OwnOrAdmin(req, res, next) {
  if (req.user.role === 1000 || req.params.id === req.user._id.toString()) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}

export function roleAdminManager(req, res, next) {
  if (req.user.role === 1000 || req.user.role === 2) {
    return next();
  }
  return res.sendStatus(HTTPStatus.FORBIDDEN);
}