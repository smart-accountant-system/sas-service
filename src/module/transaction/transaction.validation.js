import Joi from 'joi';

export default {
  createTransaction: {
    body: {
      payment: Joi.string().required(),
      description: Joi.string().required(),
      firstAccount: Joi.object({
        _id: Joi.string().required(),
        cost: Joi.number().required(),
      }),
      secondAccount: Joi.object({
        _id: Joi.string().required(),
        cost: Joi.number().required(),
      }),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
