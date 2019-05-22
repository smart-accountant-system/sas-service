import userRoutes from './user/user.route';
import companyRoutes from './company/company.route';
import invoiceRoutes from './invoice/invoice.route';
import customerRoutes from './customer/customer.route';
import paymentRoutes from './payment/payment.route';
import categoryRoutes from './payment-category/category.route';
import transactionRoutes from './transaction/transaction.route';

export default app => {
  app.use('/user', userRoutes);
  app.use('/company', companyRoutes);
  app.use('/invoice', invoiceRoutes);
  app.use('/customer', customerRoutes);
  app.use('/payment', paymentRoutes);
  app.use('/category', categoryRoutes);
  app.use('/transaction', transactionRoutes);
};
