import mongoose, { Schema } from 'mongoose';
import slug from 'slug';

const AccountSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: [true, 'Account name must be unique'],
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, {
  timestamps: true,
});

AccountSchema.statics = {
  createAccount(args, userID) {
    return this.create({
      ...args,
      createdBy: userID,
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
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  },
};

AccountSchema.index({ name: 'text' });

export default mongoose.model('Account', AccountSchema);