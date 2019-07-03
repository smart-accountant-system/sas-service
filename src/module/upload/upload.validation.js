import Joi from 'joi';

export default {
  upload: {
    body: {
      file: Joi.binary(),
    },
  },
};
