//TODO: Completar Modelo con Mongoose:
import mongoose from "mongoose";

const collectionName = "carritos";

const cartSchema = new mongoose.Schema({
  products: {
    type: Array,
    default: [], //Esto reemplaza al required, porque lo pone vacío por omisión.
    quantity: Number,
  },
});

// exportar
const cartsModel = mongoose.model(collectionName, cartSchema);

export default cartsModel;
