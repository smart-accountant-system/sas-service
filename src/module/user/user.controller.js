import HTTPStatus from 'http-status';
import User from './user.model';

export const getUserList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const search = req.query.search;

  try {
    const queries = (!search) ? { isRemoved: false } : { $text: { $search: search }, isRemoved: false };
    const users = await User.list({ search, queries })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', '_id fullname');
    const total = await User.count(queries);
    return res.status(HTTPStatus.OK).json({ users, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User
      .findOne({ _id: req.params.id, isRemoved: false });
    return res.status(HTTPStatus.OK).json(user.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const authUser = async (req, res, next) => {
  try {
    res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
    return next();
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    // if (req.user.role < req.body.role) {
    //   return res.sendStatus(HTTPStatus.FORBIDDEN);
    // }
    const user = await User.create({ ...req.body });
    return res.status(HTTPStatus.CREATED).json(user.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isRemoved: false });
    if (!user) {
      throw new Error('Not found');
    }
    Object.keys(req.body).forEach(key => {
      user[key] = req.body[key];
    });
    await user.save();
    return res.status(HTTPStatus.OK).json(user.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id, isRemoved: false });
    if (!user) {
      throw new Error('Not found');
    }
    if (req.user.role < user.role ||
      (req.user.role == user.role && req.user._id == user.createdBy)) {
      return res.sendStatus(HTTPStatus.FORBIDDEN);
    }

    user.isRemoved = true;
    await user.save();
    return res.status(HTTPStatus.OK).json(user.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
};
