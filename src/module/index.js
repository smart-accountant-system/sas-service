import userRoutes from './user/user.route';
import companyRoutes from './company/company.route';

export default app => {
  app.use('/user', userRoutes);
  app.use('/company', companyRoutes);
};
