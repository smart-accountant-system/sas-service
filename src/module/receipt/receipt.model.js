import mongoose, { Schema } from 'mongoose';
import constants from '../../config/constants';

const ReceiptSchema = new Schema({
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  status: {
    type: Boolean,
    default: constants.RECEIPT_STATUS.NEW,
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


ReceiptSchema.statics = {
  createReceipt(args, user) {
    return this.create({
      ...args,
      company: user.company,
    });
  },
};

ReceiptSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      customer: this.customer,
      payment: this.payment,
      status: this.status,
      createdAt: this.createdAt,
    };
  },
};

export default mongoose.model('Receipt', ReceiptSchema);
