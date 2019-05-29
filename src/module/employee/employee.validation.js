import Joi from 'joi';

export default {
  createEmployee: {
    body: {
      username: Joi.string().min(3).max(120).required(),
      password: Joi.string().min(6).max(120).required(),
      fullname: Joi.string().min(3).max(80).required(),
      role: Joi.number().min(0).max(2).required(),
      email: Joi.string().max(120),
      phone: Joi.string().max(10).required(),
      avatar: Joi.string(),
      company: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  login: {
    body: {
      username: Joi.string().required(),
      password: Joi.string().required(),
    },
  },
  editProfile: {
    body: {
      username: Joi.string().min(3).max(120),
      password: Joi.string().min(6).max(120),
      fullname: Joi.string().min(3).max(80),
      role: Joi.number().min(0).max(2),
      email: Joi.string().max(120),
      phone: Joi.string().max(10),
      avatar: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
