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
  type: {
    type: Number,
    required: true,
    validate: {
      validator(v) {
        return v == constants.RECEIPT.TYPE.IN || v == constants.RECEIPT.TYPE.OUT;
      },
      message: props => `${props.value} is not a valid type number`,
    },
  },

  status: {
    type: Boolean,
    default: constants.RECEIPT.STATUS.NEW,
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
      type: this.type,
      createdAt: this.createdAt,
    };
  },
};

export default mongoose.model('Receipt', ReceiptSchema);
