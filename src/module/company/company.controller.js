import HTTPStatus from 'http-status';
import Company from './company.model';

export async function getCompanyList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const search = req.query.search;
  try {
    const queries = (!search) ? { isRemoved: false } : { $text: { $search: search }, isRemoved: false };
    const companies = await Company.list({ search, queries })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', '_id fullname');
    const total = await Company.count(queries);
    return res.status(HTTPStatus.OK).json({ companies, total });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function getDetailCompany(req, res) {
  try {
    if (req.user.role && req.params.id != req.user.company) {
      return res.sendStatus(HTTPStatus.FORBIDDEN);
    }

    const company = await Company
      .findOne({ _id: req.params.id, isRemoved: false })
      .populate('createdBy', '-_id username fullname');
    if (!company) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    return res.status(HTTPStatus.OK).json(company);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function createCompany(req, res) {
  try {
    const company = await Company.createCompany(req.body, req.user._id);
    return res.status(HTTPStatus.CREATED).json(company);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function updateCompany(req, res) {
  try {
    const company = await Company.findOne({ _id: req.params.id, isRemoved: false });
    if (!company) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    Object.keys(req.body).forEach(key => {
      company[key] = req.body[key];
    });

    await company.save();

    return res.status(HTTPStatus.OK).json(company);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}

export async function deleteCompany(req, res) {
  try {
    const company = await Company.findOne({ _id: req.params.id, isRemoved: false });
    if (!company) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    company.isRemoved = true;
    await company.save();
    return res.status(HTTPStatus.OK).json(company);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
