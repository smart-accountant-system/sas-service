import HTTPStatus from 'http-status';
import Admin from './admin.model';

export const getAdminList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const search = req.query.search;

  try {
    const queries = (!search) ? { isRemoved: false } : { $text: { $search: search }, isRemoved: false };
    const admins = await Admin.list({ search, queries })
      .skip(skip)
      .limit(limit);
    const total = await Admin.count(queries);
    return res.status(HTTPStatus.OK).json({ admins, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id, isRemoved: false });
    return res.status(HTTPStatus.OK).json(admin.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    return res.status(HTTPStatus.CREATED).json(admin.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id, isRemoved: false });
    if (!admin) {
      throw new Error('Not found');
    }
    
    if (req.user.createdAt > admin.createdAt) {
      return res.sendStatus(HTTPStatus.FORBIDDEN);
    }

    Object.keys(req.body).forEach(key => {
      admin[key] = req.body[key];
    });
    await admin.save();
    return res.status(HTTPStatus.OK).json(admin.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({ _id: req.params.id, isRemoved: false });
    if (!admin) {
      throw new Error('Not found');
    }

    if (req.user.createdAt > admin.createdAt) {
      return res.sendStatus(HTTPStatus.FORBIDDEN);
    }

    admin.isRemoved = true;
    await admin.save();
    return res.status(HTTPStatus.OK).json(admin.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
};
