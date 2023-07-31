// models/contact.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IContact extends Document {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  birthdate: Date;
  userId: Schema.Types.ObjectId;
}

export const contactSchema = new Schema<IContact>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (value: string) => /\S+@\S+\.\S+/.test(value),
      message: "Invalid email format",
    },
  },
  birthdate: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

contactSchema.index({ userId: 1, phoneNumber: 1 }, { unique: true });

export const Contact = mongoose.model<IContact>("Contact", contactSchema);
