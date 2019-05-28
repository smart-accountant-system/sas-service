import Joi from 'joi';

export default {
  createCompany: {
    body: {
      name: Joi.string().required(),
      email: Joi.string().max(120),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  editCompany: {
    body: {
      name: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
      email: Joi.string().max(120),
    },
  },
};
