import mongoose, { Schema } from 'mongoose';

const AccountSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: [true, 'Account name must be unique'],
  },
  description: {
    type: String,
    required: true,
  },

  debit: {
    type: Number,
    default: 0,
  },
  credit: {
    type: Number,
    default: 0,
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

AccountSchema.statics = {
  createAccount(args, company) {
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

AccountSchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      description: this.description,
      debit: this.debit,
      credit: this.credit,
      createdAt: this.createdAt,
    };
  },
};

AccountSchema.index({ name: 'text' });

export default mongoose.model('Account', AccountSchema);
