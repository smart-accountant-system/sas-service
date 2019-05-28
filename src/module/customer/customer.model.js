import mongoose, { Schema } from 'mongoose';

const CustomerSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: [true, 'Company name must be unique'],
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    maxlength: [10, 'Phone length must equal 10'],
  },
  address: {
    type: String,
    required: true,
  },

  isRemoved: {
    type: Boolean,
    default: false,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
});

CustomerSchema.statics = {
  createCustomer(args, user) {
    return this.create({
      ...args,
      company: user.company,
    });
  },
  list({ search, queries } = {}) {
    return search ?
      this.find(queries, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }) :
      this.find(queries).sort({ name: 1 });
  },
};

CustomerSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      phone: this.phone,
      address: this.addres,
    };
  },
};

CustomerSchema.index({ name: 'text' });

export default mongoose.model('Customer', CustomerSchema);
