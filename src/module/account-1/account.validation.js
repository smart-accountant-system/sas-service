import Joi from 'joi';

export default {
  createAccount: {
    body: {
      name: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  editAccount: {
    body: {
      name: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
