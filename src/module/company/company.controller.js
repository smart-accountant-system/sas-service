/* eslint-disable no-param-reassign */
import HTTPStatus from 'http-status';
import Company from './company.model';
import { transporter, getConfirmCompanyMail } from '../../service/mailer';
import constants from '../../config/constants';

export async function getCompanyList(req, res) {
  const limit = parseInt(req.query.limit, 0) || 50;
  const skip = parseInt(req.query.skip, 0) || 0;
  const search = req.query.search;
  try {
    const queries = (!search) ? { isRemoved: false } : { $text: { $search: search }, isRemoved: false };
    const companies = await Company.list({ search, queries })
      .skip(skip)
      .limit(limit);
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
      .findOne({ _id: req.params.id, isRemoved: false });
    if (!company) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    return res.status(HTTPStatus.OK).json(company);
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}


export const sendConfirmMail = async (req, res) => {
  try {
    const company = await Company.findOne({ email: req.params.email, isRemoved: false, isConfirmed: false });
    if (!company) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    
    transporter.sendMail(
      getConfirmCompanyMail(company.toJSON(), company.generateJWT(constants.MAIL_TOKEN_LIFESPAN))
    );

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};


export const confirmCompany = async (req, res) => {
  try {
    req.user.isConfirmed = true;
    await req.user.save();
    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export async function createCompany(req, res) {
  try {
    const company = await Company.create({ ...req.body });

    transporter.sendMail(
      getConfirmCompanyMail(company.toJSON(), company.generateJWT(constants.MAIL_TOKEN_LIFESPAN))
    );
    
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
