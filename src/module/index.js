import userRoutes from './user/user.route';
import companyRoutes from './company/company.route';
import invoiceRoutes from './invoice/invoice.route';
import customerRoutes from './customer/customer.route';
import paymentRoutes from './payment/payment.route';
import categoryRoutes from './payment-category/category.route';
import transactionRoutes from './transaction/transaction.route';

export default app => {
  app.use('/users', userRoutes);
  app.use('/companies', companyRoutes);
  app.use('/invoices', invoiceRoutes);
  app.use('/customers', customerRoutes);
  app.use('/payments', paymentRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/transactions', transactionRoutes);
};
