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
  cost: {
    type: Number,
    required: true,
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

PaymentSchema.statics = {
  createPayment(args, user) {
    return this.create({
      ...args,
      company: user.company,
      createdBy: user._id,
    });
  },
};

PaymentSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      invoice: this.invoice,
      category: this.category,
      cost: this.cost,
      company: this.company,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  },
};

export default mongoose.model('Payment', PaymentSchema);