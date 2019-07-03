import nodemailer from 'nodemailer';
import constants from '../config/constants';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: constants.EMAIL_US,
    pass: constants.EMAIL_PW,
  },
});

export const getConfirmMail = (email, token) => ({
  from: constants.EMAIL_US,
  to: email,
  subject: 'Confirm email from Smart Accountant System',
  html: `Please click  <a href="${constants.CONFIRM_LINK + token}">here</a> to confirm your email.`,
});

export const getResetPasswordMail = (email, token) => ({
  from: constants.EMAIL_US,
  to: email,
  subject: 'Reset password email from Smart Accountant System',
  html: `Please click  <a href="${constants.RESET_PW_LINK + token}">here</a> to reset your password.`,
});
