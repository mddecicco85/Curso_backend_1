//TODO: Implementar Modelo con Mongoose:
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "productos";

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    index: true
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    index: true
  },
  thumbnails: {
    type: Array,
    default: [],
  },
});

productSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model(productCollection, productSchema);

export default productsModel;
