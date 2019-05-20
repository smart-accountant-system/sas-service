import Joi from 'joi';

export default {
  createCompany: {
    body: {
      name: Joi.string().required(),
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
    },
  },
};
