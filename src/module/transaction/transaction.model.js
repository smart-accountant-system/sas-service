import mongoose, { Schema } from 'mongoose';

const TransactionSchema = new Schema({
  payment: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  firstAccount: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
  },
  secondAccount: {
    _id: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
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
      createdBy: user._id,
    });
  },
};

TransactionSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      payment: this.payment,
      description: this.description,
      firstAccount: this.firstAccount,
      secondAccount: this.secondAccount,
      company: this.company,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  },
};

export default mongoose.model('Transaction', TransactionSchema);
