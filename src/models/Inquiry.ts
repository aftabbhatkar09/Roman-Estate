import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  email: string;
  phone: string;
  requirementType: 'Buying' | 'Selling' | 'Renting';
  bhk?: '1 BHK' | '2 BHK' | '3 BHK' | '4 BHK';
  message: string;
  propertyId?: mongoose.Types.ObjectId;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    requirementType: {
      type: String,
      enum: ['Buying', 'Selling', 'Renting'],
      required: true,
    },
    bhk: {
      type: String,
      enum: ['1 BHK', '2 BHK', '3 BHK', '4 BHK'],
    },
    message: { type: String, required: true },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
    status: {
      type: String,
      enum: ['New', 'In Progress', 'Resolved'],
      default: 'New',
    },
  },
  { timestamps: true }
);

// Speeds up the admin inquiries listing, which always sorts newest first.
InquirySchema.index({ createdAt: -1 });

export default mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
