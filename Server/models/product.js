import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  image: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { 
    type: String, 
    required: true, 
    uppercase: true,
    enum: ["MOBILE", "LAPTOP", "EARBUDS"]
  },
  ratings: { type: Array, default: [] },
  averageRating: { type: Number, default: 0 }
}, { timestamps: true }); 

productSchema.index({ category: 1 });

const ProductModel = mongoose.model("items", productSchema);
export default ProductModel;
