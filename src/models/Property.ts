import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  location: {
    address: string;
    area: string;
    city: string;
  };
  type: 'Apartment' | 'Commercial';
  status: 'For Sale' | 'For Rent';
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  amenities: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    location: {
      address: { type: String, required: true },
      area: { type: String, required: true },
      city: { type: String, required: true },
    },
    type: {
      type: String,
      enum: ['Apartment', 'Commercial'],
      required: true,
    },
    status: {
      type: String,
      enum: ['For Sale', 'For Rent'],
      required: true,
    },
    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    size: { type: Number, required: true }, // in sq ft
    images: { type: [String], default: [] },
    amenities: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema);
