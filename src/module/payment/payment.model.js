import mongoose, { Schema } from 'mongoose';
import constants from '../../config/constants';

const PaymentSchema = new Schema({
  invoice: {
    type: Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentCategory',
    required: true,
  },
  amountMoney: {
    type: Number,
    required: true,
  },
  type: {
    type: Number,
    required: true,
    validate: {
      validator(v) {
        return v == constants.PAYMENT.IN || v == constants.PAYMENT.OUT;
      },
      message: props => `${props.value} is not a valid type number`,
    },
  },
  description: {
    type: String,
    required: true,
  },
  receipt: {
    type: Schema.Types.ObjectId,
    ref: 'Receipt',
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

PaymentSchema.statics = {
  createPayment(args, user) {
    return this.create({
      ...args,
      company: user.company,
    });
  },
};

PaymentSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      type: this.type,
      category: this.category,
      amountMoney: this.amountMoney,
      description: this.description,
      createdAt: this.createdAt,
      invoice: this.invoice,
      receipt: this.receipt,
    };
  },
};

export default mongoose.model('Payment', PaymentSchema);
