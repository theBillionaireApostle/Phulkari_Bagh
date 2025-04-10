import { Schema, model, models } from "mongoose";

// Schema for each image stored on Cloudinary
const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    desc: { type: String },
    price: { type: String, required: true },
    defaultImage: { type: ImageSchema },
    imagesByColor: {
      type: Map,
      of: [ImageSchema],
      default: {},
    },
    colors: { type: [String], default: [] },
    sizes: { type: [Schema.Types.Mixed], default: [] },
    badge: { type: String },
    justIn: { type: Boolean, default: false },
    // Published flag for toggling the product status.
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.Product || model("Product", ProductSchema);
