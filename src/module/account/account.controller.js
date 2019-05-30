import HTTPStatus from 'http-status';
import Account from './account.model';
import constants from '../../config/constants';

export async function getAccountList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const search = req.query.search;
  try {
    const queries = (!search) ? { isRemoved: false } : { $text: { $search: search }, isRemoved: false };
    const accounts = await Account.list({ search, queries })
      .skip(skip)
      .limit(limit);
    const total = await Account.count(queries);
    return res.status(HTTPStatus.OK).json({ accounts, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getDetailAccount(req, res) {
  try {
    const account = await Account
      .findOne({ _id: req.params.id, isRemoved: false });
    if (!account) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    if (req.user.role !== constants.ROLE.SYSTEM_ADMIN && req.user.account != account._id) {
      return res.sendStatus(HTTPStatus.FORBIDDEN);
    }

    return res.status(HTTPStatus.OK).json(account);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function createAccount(req, res) {
  try {
    const account = await Account.createAccount(req.body, req.user.company);
    return res.status(HTTPStatus.CREATED).json(account);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function updateAccount(req, res) {
  try {
    const account = await Account.findOne({ _id: req.params.id, isRemoved: false });
    if (!account) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    Object.keys(req.body).forEach(key => {
      account[key] = req.body[key];
    });

    await account.save();

    return res.status(HTTPStatus.OK).json(account);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function deleteAccount(req, res) {
  try {
    const account = await Account.findOne({ _id: req.params.id, isRemoved: false });
    if (!account) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    account.isRemoved = true;
    await account.save();
    return res.status(HTTPStatus.OK).json(account);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
