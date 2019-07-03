import Joi from 'joi';

export default {
  register: {
    body: {
      company: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().max(120).required(),
      }).required(),
      employee: Joi.object({
        username: Joi.string().min(3).max(120).required(),
        password: Joi.string().min(6).max(120).required(),
        fullname: Joi.string().min(3).max(80).required(),
        email: Joi.string().max(120).required(),
        phone: Joi.string().max(10).required(),
        avatar: Joi.string(),
      }).required(),
    },
    options: {
      allowUnknownBody: false,
    },
  },
};
