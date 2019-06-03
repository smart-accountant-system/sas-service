import jwt from 'jsonwebtoken';
import mongoose, { Schema } from 'mongoose';
import { compareSync, hashSync } from 'bcrypt-nodejs';
import constants from '../../config/constants';

const AdminSchema = new Schema({
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
  isRemoved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

AdminSchema.pre('save', function (next) {
  if (this.isModified('password')) {
    this.password = this.hashPassword(this.password);
  }
  return next();
});

AdminSchema.methods = {
  hashPassword(password) {
    return hashSync(password);
  },

  validatePassword(password) {
    return compareSync(password, this.password);
  },

  generateJWT(lifespan) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + lifespan);

    return jwt.sign(
      {
        _id: this._id,
        role: 'admin',
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
      avatar: this.avatar,
      phone: this.phone,
      email: this.email,
    };
  },

  toAuthJSON() {
    return {
      ...this.toJSON(),
      token: this.generateJWT(constants.AUTH_TOKEN_LIFESPAN),
    };
  },
};

AdminSchema.index({ fullname: 'text' });

AdminSchema.statics = {
  list({ search, queries } = {}) {
    return search ?
      this.find(queries, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }) :
      this.find(queries).sort({ fullname: 1 });
  },
};

export default mongoose.model('Admin', AdminSchema);
