import mongoose, { Schema } from 'mongoose';

const CompanySchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: [true, 'Company name must be unique'],
  },
  isRemoved: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

CompanySchema.statics = {
  createCompany(args, userID) {
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

CompanySchema.methods = {
  toJSON() {
    return {
      _id: this._id,
      name: this.name,
      createdBy: this.createdBy,
      createdAt: this.createdAt,
    };
  },
};

CompanySchema.index({ name: 'text' });

export default mongoose.model('Company', CompanySchema);
