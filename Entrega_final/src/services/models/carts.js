//TODO: Completar Modelo con Mongoose:
import mongoose from "mongoose";

const collectionName = "carritos";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "productos",
        },
        quantity: Number
      },
    ],
    default: [], //Esto reemplaza al required, porque lo pone vacío por omisión.
  },
});

// exportar
const cartsModel = mongoose.model(collectionName, cartSchema);

export default cartsModel;
