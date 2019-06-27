import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import { compareSync, hashSync } from 'bcrypt-nodejs';
import constants from '../../config/constants';

const EmployeeSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: [true, 'Username must be unique'],
    minlength: [3, 'Username must equal or longer than 3'],
    maxlength: [120, 'Username must equal or shorter than 120'],
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must equal or longer than 6'],
    maxlength: [120, 'Password must equal or shorter than 120'],
  },
  fullname: {
    type: String,
    required: true,
    minlength: [3, 'Fullname must equal or longer than 3'],
    maxlength: [80, 'Fullname must equal or shorter than 80'],
  },
  role: {
    type: Number, // 0: employee, 1: kế toán, 2: quản lý
    required: true,
    validate: {
      validator(v) {
        return v == constants.ROLE.ACCOUNTANT || v == constants.ROLE.MANAGER || v == constants.ROLE.SYSTEM_ADMIN || v == constants.ROLE.STAFF;
      },
      message: props => `${props.value} is not a valid role number`,
    },
  },
  avatar: {
    trim: true,
    type: String,
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    maxlength: [10, 'Phone must equal or shorter than 10'],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    maxlength: [120, 'Email must equal or shorter than 120'],
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

EmployeeSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }
  return next();
});

EmployeeSchema.methods = {
  hashPassword(password) {
    return hashSync(password);
  },

  validatePassword(password) {
    return compareSync(password, this.password);
  },

  generateJWT(lifespan) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setSeconds(today.getSeconds() + 30);

    return jwt.sign(
      {
        _id: this._id,
        role: 'employee',
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      },
      constants.JWT_SECRET,
    );
  },

  toJSON() {
    return {
      _id: this._id,
      username: this.username,
      fullname: this.fullname,
      role: this.role,
      avatar: this.avatar,
      phone: this.phone,
      email: this.email,
      company: this.company,
    };
  },

  toAuthJSON() {
    return {
      ...this.toJSON(),
      token: this.generateJWT(constants.AUTH_TOKEN_LIFESPAN),
    };
  },
};

EmployeeSchema.index({ fullname: 'text' });

EmployeeSchema.statics = {
  list({ search, queries } = {}) {
    return search ?
      this.find(queries, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }) :
      this.find(queries).sort({ fullname: 1 });
  },
};

export default mongoose.model('Employee', EmployeeSchema);
