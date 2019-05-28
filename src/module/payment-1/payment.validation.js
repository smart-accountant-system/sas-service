import Joi from 'joi';

export default {
  createPayment: {
    body: {
      invoice: Joi.string().required(),
      category: Joi.string().required(),
      cost: Joi.number().min(0).required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  // editPayment: {
  //   body: {
  // invoice: Joi.string(),
  // category: Joi.string(),
  // cost: Joi.number().min(0),
  //   },
  //   options: {
  //     allowUnknownBody: false,
  //   },
  // },
};
