import nodemailer from 'nodemailer';
import constants from '../config/constants';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: constants.EMAIL_US,
    pass: constants.EMAIL_PW,
  },
});

export const getConfirmCompanyMail = ({ name, email }, token) => ({
  from: constants.EMAIL_US,
  to: email,
  subject: '[Smart Accountant System] Email confirmation for Company',
  html: `
Dear <b>${name}</b>,<br />
<br /><br />
You have just made a request to confirm email via Smart Accountant System for <b>your company</b>. 
To complete the confirmation, please click <a href="${constants.COMPANY_CONFIRM_LINK + token}">here</a> or 
copy and paste the link below in the browser:<br />
${constants.COMPANY_CONFIRM_LINK + token}<br />
<br /><br />
If not, please <b>DO NOT</b> click on the link above.<br />
<b><font color="red">This email is valid in ${constants.MAIL_TOKEN_LIFESPAN} days left.</font></b><br />
<br /><br />
SAS Team.
`,
});


export const getConfirmEmployeeMail = ({ fullname, email }, token) => ({
  from: constants.EMAIL_US,
  to: email,
  subject: '[Smart Accountant System] Email confirmation for Employee',
  html: `
Dear <b>${fullname}</b>,<br />
<br />
You have just made a request to confirm email via Smart Accountant System. 
To complete the confirmation, please click <a href="${constants.EMLOYEE_CONFIRM_LINK + token}">here</a> or 
copy and paste the link below in the browser:<br />
${constants.EMLOYEE_CONFIRM_LINK + token}<br />
<br /><br />
If not, please <b>DO NOT</b> click on the link above.<br />
<b><font color="red">This email is valid in ${constants.MAIL_TOKEN_LIFESPAN} days left.</font></b><br />
<br /><br />
SAS Team.
`,
});


export const getResetPasswordMail = (email, token) => ({
  from: constants.EMAIL_US,
  to: email,
  subject: 'Reset password email from Smart Accountant System',
  html: `Please click  <a href="${constants.RESET_PW_LINK + token}">here</a> to reset your password.`,
});
