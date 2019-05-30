import mongoose, { Schema } from 'mongoose';
import constants from '../../config/constants';

const TransactionSchema = new Schema({
  receipt: {
    type: Schema.Types.ObjectId,
    ref: 'Receipt',
    required: true,
  },
  fromAccount: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      required: true,
      validate: {
        validator(v) {
          return v == constants.ACCOUNT_TYPE.CREDIT || v == constants.ACCOUNT_TYPE.DEBIT;
        },
        message: props => `${props.value} is not a valid type number`,
      },
    },
  },
  toAccount: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      required: true,
      validate: {
        validator(v) {
          return v == constants.ACCOUNT_TYPE.CREDIT || v == constants.ACCOUNT_TYPE.DEBIT;
        },
        message: props => `${props.value} is not a valid type number`,
      },
    },
  },
  checkedBy: {
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

TransactionSchema.statics = {
  createTransaction(args, user) {
    return this.create({
      ...args,
      company: user.company,
      checkedBy: user._id,
    });
  },
};

TransactionSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      checkedBy: this.checkedBy,
      receipt: this.receipt,
      fromAccount: this.fromAccount,
      toAccount: this.toAccount,
      createdAt: this.createdAt,
    };
  },
};

export default mongoose.model('Transaction', TransactionSchema);
