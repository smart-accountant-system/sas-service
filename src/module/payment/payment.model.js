import mongoose, { Schema } from 'mongoose';

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
  description: {
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
      invoice: this.invoice,
      category: this.category,
      amountMoney: this.amountMoney,
      description: this.description,
      createdAt: this.createdAt,
    };
  },
};

export default mongoose.model('Payment', PaymentSchema);
