const devConfig = {
  MONGO_URL: 'mongodb://localhost:27017/SAS-service-dev',
  JWT_SECRET: 'lam-choi-cho-vui-luc-ranh',
};

const prodConfig = {
  MONGO_URL: 'mongodb://sasdb:nhatquang98@ds159036.mlab.com:59036/sasdb',
  JWT_SECRET: 'sai-co-pat',
};

const defaultConfig = {
  PORT: process.env.PORT || 7777,
};

function envConfig(env) {
  switch (env) {
    case 'dev':
      return devConfig;
    default:
      return prodConfig;
  }
}

export default {
  ...defaultConfig,
  ...envConfig(process.env.NODE_ENV),
  AUTH_TOKEN_LIFESPAN: 1,
  ROLE: {
    MANAGER: 2,
    ACCOUNTANT: 1,
    EMPLOYEE: 0,
  },
};
