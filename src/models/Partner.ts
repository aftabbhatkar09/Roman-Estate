import mongoose, { Schema, Document } from "mongoose";

export interface IPartner extends Document {
  name: string;
  logo: string;
  website?: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    logo: { type: String, required: true },
    website: { type: String },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Matches the `{ active, order, createdAt }` query/sort used by the
// homepage partner carousel and the admin partners listing.
PartnerSchema.index({ active: 1, order: 1, createdAt: -1 });

export default mongoose.models.Partner ||
  mongoose.model<IPartner>("Partner", PartnerSchema);
