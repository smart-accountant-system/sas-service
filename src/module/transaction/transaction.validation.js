import Joi from 'joi';

export default {
  createTransaction: {
    body: {
      receipt: Joi.string().required(),
      fromAccount: Joi.object({
        id: Joi.string().required(),
        amount: Joi.number().min(0).required(),
        type: Joi.number().min(0).required(),
      }),
      toAccount: Joi.object({
        id: Joi.string().required(),
        amount: Joi.number().min(0).required(),
        type: Joi.number().min(0).required(),
      }),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
