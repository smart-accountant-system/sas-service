import adminRoutes from './admin/admin.route';
import employeeRoutes from './employee/employee.route';
import companyRoutes from './company/company.route';
import invoiceRoutes from './invoice/invoice.route';
import categoryRoutes from './payment-category/category.route';
import paymentRoutes from './payment/payment.route';
import customerRoutes from './customer/customer.route';
import transactionRoutes from './transaction/transaction.route';
import accountRoutes from './account/account.route';
import receiptRoutes from './receipt/receipt.route';
import dashboardRoutes from './dashboard/dashboard.route';
import uploadRoutes from './upload/upload.route';

export default app => {
  app.use('/admins', adminRoutes);
  app.use('/employees', employeeRoutes);
  app.use('/companies', companyRoutes);
  app.use('/invoices', invoiceRoutes);
  app.use('/categories', categoryRoutes);
  app.use('/payments', paymentRoutes);
  app.use('/customers', customerRoutes);
  app.use('/transactions', transactionRoutes);
  app.use('/accounts', accountRoutes);
  app.use('/receipts', receiptRoutes);
  app.use('/dashboard', dashboardRoutes);
  app.use('/upload', uploadRoutes);
};
