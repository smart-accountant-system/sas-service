import mongoose, { Schema } from 'mongoose';

const PaymentCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    required: true,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

PaymentCategorySchema.statics = {
  createPaymentCategory(args, company) {
    return this.create({
      ...args,
      company,
    });
  },
  list({ search, queries } = {}) {
    return search ?
      this.find(queries, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }) :
      this.find(queries).sort({ name: 1 });
  },
};

PaymentCategorySchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      detail: this.detail,
      createdAt: this.createdAt,
    };
  },
};

PaymentCategorySchema.index({ name: 'text' });

export default mongoose.model('PaymentCategory', PaymentCategorySchema);
