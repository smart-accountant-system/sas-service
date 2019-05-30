import Joi from 'joi';

export default {
  createAccount: {
    body: {
      name: Joi.string().required(),
      description: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  editAccount: {
    body: {
      name: Joi.string(),
      description: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
