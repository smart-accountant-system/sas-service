import mongoose, { Schema } from 'mongoose';

const InvoiceSchema = new Schema({
  // customer: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Customer',
  //   required: true,
  // },
  detail: [{
    _id: false,
    product: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    unitPrice: {
      type: Number,
      required: true,
    },
  }],
  isRemoved: {
    type: Boolean,
    default: false,
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

InvoiceSchema.statics = {
  createInvoice(args, user) {
    return this.create({
      ...args,
      company: user.company,
      createdBy: user._id,
    });
  },
  list({ search, queries } = {}) {
    return search ?
    this.find(queries, { score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } }) :
    this.find(queries).sort({ name: 1 });
  },
};

InvoiceSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      customer: this.customer,
      detail: this.detail,
      company: this.company,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  },
};

export default mongoose.model('Invoice', InvoiceSchema);