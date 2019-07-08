const devConfig = {
  MONGO_URL: 'mongodb://localhost:27017/SAS-service-dev',
  JWT_SECRET: 'lam-choi-cho-vui-luc-ranh...hok-zui-nua-r :(',
  EMAIL_US: 'sascompanyvietnam@gmail.com',
  EMAIL_PW: 'Gnauqt@hn98',
  COMPANY_CONFIRM_LINK: 'http://localhost:7777/companies/confirm/',
  EMLOYEE_CONFIRM_LINK: 'http://localhost:7777/employees/confirm/',
  PUBLISH_EXPO_LINK: 'exp://exp.host/@nhatquangsin/smart-accountant-system-native/--/',
};

const prodConfig = {
  MONGO_URL: 'mongodb://sasdb:nhatquang98@ds159036.mlab.com:59036/sasdb',
  JWT_SECRET: 'sai-co-pat',
  EMAIL_US: 'sascompanyvietnam@gmail.com',
  EMAIL_PW: 'Gnauqt@hn98',
  COMPANY_CONFIRM_LINK: 'https://smart-accountant-system.herokuapp.com/companies/confirm/',
  EMLOYEE_CONFIRM_LINK: 'https://smart-accountant-system.herokuapp.com/employees/confirm/',
  PUBLISH_EXPO_LINK: 'exp://exp.host/@nhatquangsin/smart-accountant-system-native/--/',
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
  MAIL_TOKEN_LIFESPAN: 3,
  AUTH_TOKEN_LIFESPAN: 1,
  
  ROLE: {
    MANAGER: 3,
    ACCOUNTANT: 2,
    STAFF: 1,
  },


  INVOICE: {
    PURCHASED: 0,
    SELLED: 1,
  },
  INVOICE_STATUS: {
    PAID: true,
    NOT_PAID: false,
  },

  
  PAYMENT: {
    IN: 0,
    OUT: 1,
  },
  
  RECEIPT_STATUS: {
    NEW: false,
    DONE: true,
  },
  
  ACCOUNT_TYPE: {
    CREDIT: 0,
    DEBIT: 1,
  },
};
