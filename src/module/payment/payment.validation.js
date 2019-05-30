import Joi from 'joi';

export default {
  createPayment: {
    body: {
      invoice: Joi.string().required(),
      category: Joi.string().required(),
      amountMoney: Joi.number().min(0).required(),
      description: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
