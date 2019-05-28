import Joi from 'joi';

export default {
  createCustomer: {
    body: {
      name: Joi.string().required(),
      phone: Joi.string().min(10).max(10).required(),
      address: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  editCustomer: {
    body: {
      name: Joi.string(),
      phone: Joi.string().min(10).max(10),
      address: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
