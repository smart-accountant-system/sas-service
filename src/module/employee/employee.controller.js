/* eslint-disable no-param-reassign */
/* eslint-disable no-nested-ternary */
import HTTPStatus from 'http-status';
import Employee from './employee.model';
import Company from '../company/company.model';
import { transporter, getConfirmEmployeeMail, getResetPasswordMail } from '../../service/mailer';
import constants from '../../config/constants';

export const getEmployeeList = async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 50;
  const skip = parseInt(req.query.skip, 10) || 0;
  const search = req.query.search;

  try {
    const company = req.user.company || req.query.company;
    const queries = (search && company) ? { $text: { $search: search }, isRemoved: false, company } :
      (search) ? { $text: { $search: search }, isRemoved: false } :
        (company) ? { isRemoved: false, company } :
          { isRemoved: false };

    const employees = await Employee.list({ search, queries })
      .skip(skip)
      .limit(limit);
    const total = await Employee.count(queries);
    return res.status(HTTPStatus.OK).json({ employees, total });
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const getEmployee = async (req, res) => {
  try {
    const queries = (req.user.company) ? { _id: req.params.id, isRemoved: false, company: req.user.company } :
      { _id: req.params.id, isRemoved: false };

    const employee = await Employee.findOne(queries);
    return res.status(HTTPStatus.OK).json(employee.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};


export const sendConfirmMail = async (req, res) => {
  try {
    const employee = await Employee.findOne({ username: req.params.username, isRemoved: false, isConfirmed: false });
    if (!employee) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    
    transporter.sendMail(
      getConfirmEmployeeMail(employee.toJSON(), employee.generateJWT(constants.MAIL_TOKEN_LIFESPAN))
    );

    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};



export const confirmEmployee = async (req, res) => {
  try {
    req.user.isConfirmed = true;
    await req.user.save();
    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const sendResetPasswordMail = async (req, res) => {
  try {
    const employee = await Employee.findOne({ username: req.params.username, isRemoved: false });
    if (!employee) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }
    transporter.sendMail(
      getResetPasswordMail(employee.toJSON(), employee.generateJWT(constants.MAIL_TOKEN_LIFESPAN))
    );
    return res.sendStatus(HTTPStatus.OK);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};


export const authEmployee = async (req, res, next) => {
  try {
    const company = await Company.findOne({ _id: req.user.company });

    res.status(HTTPStatus.OK).json({ ...req.user.toAuthJSON(), company: company.toJSON() });
    return next();
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const createEmployee = async (req, res) => {
  try {
    // If admin & have no company ==> return
    if (!req.user.role && !req.body.company) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    }
    const company = await Company.findOne({ _id: req.user.company || req.body.company, isRemoved: false });
    if (!company) {
      return res.sendStatus(HTTPStatus.BAD_REQUEST);
    }

    const employee = await Employee.create({ ...req.body, company: company._id });
    
    transporter.sendMail(
      getConfirmEmployeeMail(employee.toJSON(), employee.generateJWT(constants.MAIL_TOKEN_LIFESPAN))
    );

    return res.status(HTTPStatus.CREATED).json(employee.toJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.user._id, isRemoved: false });
    employee.password = req.body.password;
    await employee.save();
    return res.status(HTTPStatus.OK).json(employee.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, isRemoved: false });
    if (!employee) {
      return res.sendStatus(HTTPStatus.NOT_FOUND);
    }

    if (req.user.role == employee.role && req.user.createdAt < employee.createdAt) {
      return res.sendStatus(HTTPStatus.FORBIDDEN);
    }
    
    Object.keys(req.body).forEach(key => {
      employee[key] = req.body[key];
    });
    await employee.save();
    return res.status(HTTPStatus.OK).json(employee.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, isRemoved: false });
    if (!employee) {
      throw new Error('Not found');
    }

    if (req.user.role == employee.role && req.user.createdAt > employee.createdAt) {
      return res.sendStatus(HTTPStatus.FORBIDDEN);
    }

    employee.isRemoved = true;
    await employee.save();
    return res.status(HTTPStatus.OK).json(employee.toJSON());
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
};
