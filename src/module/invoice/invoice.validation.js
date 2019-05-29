import Joi from 'joi';

export default {
  createInvoice: {
    body: {
      detail: Joi.array().items({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
        unitPrice: Joi.number().required(),
      }).required(),
      type: Joi.number().min(0).max(1).required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  editInvoice: {
    body: {
      detail: Joi.array().items({
        product: Joi.string(),
        quantity: Joi.number(),
        unitPrice: Joi.number(),
      }),
      type: Joi.number().min(0).max(1),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
