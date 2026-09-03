import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  author: string;
  excerpt: string;
  image: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    excerpt: { type: String, required: true },
    image: { type: String, default: '' },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Speeds up the public blog listing (published posts, newest first).
// `slug` is already indexed via `unique: true` above.
BlogSchema.index({ published: 1, createdAt: -1 });
// Speeds up the admin listing, which sorts all posts (no `published`
// filter) newest first — the compound index above can't serve that
// efficiently on its own.
BlogSchema.index({ createdAt: -1 });

export default mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);
