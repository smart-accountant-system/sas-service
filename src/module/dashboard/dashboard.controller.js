import HTTPStatus from 'http-status';
import Category from '../payment-category/category.model';
import Employee from '../employee/employee.model';
import Customer from '../customer/customer.model';

export async function getDashboard(req, res) {
  try {
    const totalCategory = await Category.count({ isRemoved: false, company: req.user.company });
    const totalEmployee = await Employee.count({ isRemoved: false, company: req.user.company });
    const totalCustomer = await Customer.count({ isRemoved: false, company: req.user.company });
    return res.status(HTTPStatus.OK).json({ totalCategory, totalEmployee, totalCustomer });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
