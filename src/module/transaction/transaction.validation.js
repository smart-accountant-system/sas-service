import Joi from 'joi';

export default {
  createTransaction: {
    body: {
      receipt: Joi.string().required(),
      amount: Joi.number().min(0).required(),
      fromAccount: Joi.object({
        id: Joi.string().required(),
        type: Joi.number().min(0).required(),
      }).required(),
      toAccount: Joi.object({
        id: Joi.string().required(),
        type: Joi.number().min(0).required(),
      }).required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
