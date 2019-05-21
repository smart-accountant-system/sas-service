import userRoutes from './user/user.route';
import companyRoutes from './company/company.route';
import invoiceRoutes from './invoice/invoice.route';

export default app => {
  app.use('/user', userRoutes);
  app.use('/company', companyRoutes);
  app.use('/invoice', invoiceRoutes);
};
