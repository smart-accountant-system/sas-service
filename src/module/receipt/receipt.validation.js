import Joi from 'joi';

export default {
  createReceipt: {
    body: {
      payment: Joi.string().required(),
      customer: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
