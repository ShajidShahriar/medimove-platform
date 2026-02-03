import mongoose, { Document, Schema } from 'mongoose';

export interface ILead extends Document {
  name: string;
  phone: string;
  type: 'General Consultation' | 'Quote Request';
  items?: Array<{ name: string; id: string }>; 
  status: 'New' | 'Contacted' | 'Closed'
  
}

const LeadSchema: Schema = new Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  type: { type: String, enum: ['General Consultation', 'Quote Request'], required: true },
  items: [
    {
      name: String,
      id: String
    }
  ],
  status: { type: String, enum: ['New', 'Contacted', 'Closed'], default: 'New' } 
}, {
  timestamps: true // Saves the time they requested
});

export default mongoose.model<ILead>('Lead', LeadSchema);