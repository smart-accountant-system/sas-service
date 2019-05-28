import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';
import passport from 'passport';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDev from './swagger_dev.json';
import swaggerDocument from './swagger.json';

const isProd = process.env.NODE_ENV != 'dev';

export default app => {
  if (isProd) {
    app.use(compression());
    app.use(helmet());
  }

  app.use(morgan('tiny'));
  app.use(bodyParser.json({ limit: '5mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(passport.initialize());
  if (isProd) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } else {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDev));
  }
  app.use(cors());
};
