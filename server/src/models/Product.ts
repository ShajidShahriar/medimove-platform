import mongoose, { Document, Schema } from 'mongoose';

// 1. Define the TypeScript Interface (For Code Safety)
export interface IProduct extends Document {
  name: string;
  category: string;
  condition: 'New' | 'Refurbished';
  stockStatus: 'In Stock' | 'Low Stock' | 'Pre-Order';
  images: string[];
  specs: string[];
  price?: number; // Optional for now
}

// 2. Define the Mongoose Schema (For Database Rules)
const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, enum: ['New', 'Refurbished'], required: true },
  stockStatus: { type: String, enum: ['In Stock', 'Low Stock', 'Pre-Order'], default: 'In Stock' },
  images: [{ type: String }],
  specs: [{ type: String }], // Array of strings
  price: { type: Number, default: 0 }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// 3. Export the Model
export default mongoose.model<IProduct>('Product', ProductSchema);