import HTTPStatus from 'http-status';
import { transporter, getConfirmCompanyMail, getConfirmEmployeeMail } from '../../service/mailer';
import constants from '../../config/constants';
import Company from '../company/company.model';
import Employee from '../employee/employee.model';



export async function doRegister(req, res) {
  try {
    const companies = await Company.find({
      $or: [
        { name: req.body.company.name },
        { email: req.body.company.email },
      ] });
    const employees = await Company.find({ 
      $or: [
        { email: req.body.employee.email },
        { username: req.body.employee.username },
      ], 
    });

    console.log(companies);
    console.log(employees);
    

    if (companies.length > 0 || employees.length > 0) {
      throw new Error('Check your username and email\'s company & user ');
    }

    const company = await Company.create({ ...req.body.company });
    const employee = await Employee.create({ ...req.body.employee, role: 3, company: company._id });
  
    transporter.sendMail(
      getConfirmCompanyMail(company.toJSON(), company.generateJWT(constants.MAIL_TOKEN_LIFESPAN))
    );
    transporter.sendMail(
      getConfirmEmployeeMail(employee.toJSON(), employee.generateJWT(constants.MAIL_TOKEN_LIFESPAN))
    );
      
    return res.status(HTTPStatus.CREATED).json({ 
      company: company.toJSON(),
      employee: employee.toAuthJSON(), 
    });
  } catch (e) {
    return res.status(HTTPStatus.BAD_REQUEST).json(e.message);
  }
}
  
  
