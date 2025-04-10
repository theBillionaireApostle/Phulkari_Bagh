// lib/models/User.ts
/* eslint-disable @typescript-eslint/no-require-imports */

import mongoose, { model, models } from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    displayName: { type: String },
    role: { type: String, default: "user" }, // "admin" for admin users
    password: { type: String }, // New field for locally stored password (hashed)
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
