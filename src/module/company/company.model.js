import mongoose, { Schema } from 'mongoose';
import jwt from 'jsonwebtoken';
import constants from '../../config/constants';

const CompanySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: [true, 'Company name must be unique'],
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
    maxlength: [120, 'Email must equal or shorter than 120'],
  },
  isConfirmed: {
    type: Boolean,
    default: false,
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

CompanySchema.statics = {
  list({ search, queries } = {}) {
    return search ?
      this.find(queries, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }) :
      this.find(queries).sort({ name: 1 });
  },
};

CompanySchema.methods = {
  
  generateJWT(lifespan) {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + lifespan);

    return jwt.sign(
      {
        _id: this._id,
        role: 'company',
        exp: parseInt(expirationDate.getTime() / 1000, 10),
      },
      constants.JWT_SECRET,
    );
  },

  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt,
    };
  },
};

CompanySchema.index({ name: 'text' });

export default mongoose.model('Company', CompanySchema);
