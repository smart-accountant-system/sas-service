const devConfig = {
  MONGO_URL: 'mongodb://localhost:27017/SAS-service-dev',
  JWT_SECRET: 'lam-choi-cho-vui-luc-ranh',
};

const prodConfig = {
  MONGO_URL: 'mongodb://thienhaco:22196c97c6110f2c04525395ca8394a7@localhost:27017/SAS-service',
  JWT_SECRET: '',
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
};
