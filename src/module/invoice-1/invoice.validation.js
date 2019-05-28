import Joi from 'joi';

export default {
  createInvoice: {
    body: {
      detail: Joi.array().items({
        product: Joi.string().required(),
        quantity: Joi.number().required(),
        unitPrice: Joi.number().required(),
      }).required(),
      customer: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  // editInvoice: {
  //   body: {
  //     customer: Joi.string(),
  //   },
  //   options: {
  //     allowUnknownBody: false,
  //   },
  // },
};