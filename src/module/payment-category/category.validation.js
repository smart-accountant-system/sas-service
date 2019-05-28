import Joi from 'joi';

export default {
  createCategory: {
    body: {
      name: Joi.string().required(),
      detail: Joi.string().required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
  editCategory: {
    body: {
      name: Joi.string(),
      detail: Joi.string(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
