import mongoose, { Schema } from 'mongoose';
import constants from '../../config/constants';

const InvoiceSchema = new Schema({
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
  type: {
    type: Number,
    required: true,
    validate: {
      validator(v) {
        return v == constants.INVOICE.PURCHASED || v == constants.INVOICE.SELLED;
      },
      message: props => `${props.value} is not a valid type number`,
    },
  },

  totalCost: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'Employee',
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

InvoiceSchema.pre('validate', function (next) {
  this.calculateTotalCost();
  next();
});

InvoiceSchema.statics = {
  createInvoice(args, user) {
    return this.create({
      ...args,
      createdBy: user._id,
      company: user.company,
    });
  },
};

InvoiceSchema.methods = {
  calculateTotalCost() {
    this.totalPayment = this.detail.reduce((total, item) => total + (item.unitPrice * item.quantity), 0);
  },
  toJSON() {
    return {
      _id: this._id,
      type: this.type,
      detail: this.detail,
      totalCost: this.totalCost,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  },
};

export default mongoose.model('Invoice', InvoiceSchema);
