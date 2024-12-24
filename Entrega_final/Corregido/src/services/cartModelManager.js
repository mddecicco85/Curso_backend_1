import fs from "fs";
import mongoose from "mongoose";
import cartsModel from "./models/carts.js";
import productsModel from "./models/products.js";

export default class cartManager {
  //PARA VER TODOS LOS CARRITOS (NO SE PIDE EN LA CONSIGNA).
  async listarCarritos() {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        console.log("Conectado_listar.");
        let carritos = [];
        carritos = await cartsModel.find();
        return carritos;
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
  }

  //FUNCIÓN PARA VER EL CARRITO CON ESE id
  async mostrarCarrito(id) {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        //console.log("Conectado_mostrar.");
        let carrito = await cartsModel.findOne({ _id: id });
        if (!carrito) {
          return null;
        } else {
          return carrito;
        }
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
  }

  //FUNCIÓN QUE AGREGA UN PRODUCTO AL CARRITO.
  async agregarAlCarrito(cid, pid, quantity) {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        let carrito = await cartsModel.findOne({ _id: cid });
        //findOne devuelve un objeto. En cambio find devuelve un vector.
        //console.log(carrito);
        if (!carrito) {
          return 1;
        }

        let producto = await productsModel.findOne({ _id: pid });
        //Busco el producto con ese id.

        //console.log("hola", producto);
        if (!producto) {
          return 0;
        }
        let quantityOriginal = quantity;
        if (!quantity) {
          quantity = 1;
        }
        let indiceProducto = carrito.products.findIndex(
          (p) => p.product.toString() === pid //Con p._id === pid no funciona. Ver Copilot.
        );
        if (indiceProducto === -1) {
          carrito.products.push({ product: pid, quantity }); //Agrega producto.
        } else {
          if (!quantityOriginal) {
            //Si no ingresó quantity, que incremente de a uno.
            carrito.products[indiceProducto].quantity++;
          } else {
            //Si ingresó quantity (aunque sea 1), que actualice la cantidad al número pasado.
            carrito.products[indiceProducto].quantity = quantity; //Actualiza cantidad de producto.
          }
        }
        let result = await cartsModel.updateOne({ _id: cid }, carrito);
        //await carrito.save();

        let carritoModificado = await cartsModel
          .findOne({ _id: cid })
          .populate("products.product");
        console.log(JSON.stringify(carritoModificado, null, "\t"));
        return producto;
      } catch (error) {
        console.log(error);
        return null; //Si no había productos, lo pone vacío.
      }
    };
    return await connectMongoDB();
  }

  async agregarCarrito() {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        console.log("Conectado_agregar.");
        const nuevoCarrito = {};
        let result = await cartsModel.create(nuevoCarrito);
        console.log(result);
        return result;
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
  }

  async vaciarCarrito(cid) {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        //console.log("Conectado_agregar.");
        let result = await cartsModel.updateOne(
          { _id: cid },
          { $set: { products: [] } }
        );
        let carrito = await cartsModel.findOne({ _id: cid });
        //console.log("hola", carrito);
        return carrito;
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
  }

  async setearCarrito(cid, vectorProductos) {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        //console.log("Conectado_agregar.");
        let quantity;
        let carrito = await cartsModel.findOne({ _id: cid });
        let nuevoCarrito = {
          products: [], // Inicializar como un array vacío
        };
        vectorProductos.forEach((p) => {
          if (!p.quantity) {
            quantity = 1;
          } else {
            quantity = p.quantity;
          }
          nuevoCarrito.products.push({ p, quantity });
        });
        let result = await cartsModel.updateOne({ _id: cid }, nuevoCarrito);

        carrito = await cartsModel.findOne({ _id: cid });
        //console.log("hola", carrito);
        return carrito;
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
  }

  //FUNCIÓN QUE AGREGA UN PRODUCTO AL CARRITO.
  async eliminarDelCarrito(cid, pid) {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        let carrito = await cartsModel.findOne({ _id: cid });
        //findOne devuelve un objeto. En cambio find devuelve un vector.
        //console.log(carrito);
        if (!carrito) {
          return 1;
        }

        let producto = await productsModel.findOne({ _id: pid });
        //Busco el producto con ese id.

        //console.log("hola", producto);
        if (!producto) {
          return 0;
        }
        let indiceProducto = carrito.products.findIndex(
          (p) => p.product.toString() === pid //Con p._id === pid no funciona. Ver Copilot.
        );

        carrito.products.splice(indiceProducto, 1);

        let result = await cartsModel.updateOne({ _id: cid }, carrito);
        //await carrito.save();

        let carritoModificado = await cartsModel
          .findOne({ _id: cid })
          .populate("products.product");
        console.log(JSON.stringify(carritoModificado, null, "\t"));
        return producto;
      } catch (error) {
        console.log(error);
        return null; //Si no había productos, lo pone vacío.
      }
    };
    return await connectMongoDB();
  }
}
