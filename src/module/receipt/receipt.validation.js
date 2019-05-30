import Joi from 'joi';

export default {
  createReceipt: {
    body: {
      payment: Joi.string().required(),
      customer: Joi.string().required(),
      type: Joi.number().min(0).max(1).required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
