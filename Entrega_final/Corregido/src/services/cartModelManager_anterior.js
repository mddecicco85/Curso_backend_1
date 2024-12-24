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
        console.log("Conectado_mostrar.");
        let carrito = await cartsModel.find({ _id: id });
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
        let producto = await productsModel.findOne({ _id: pid });
        //Busco el producto con ese id.

        console.log("hola", producto);
        if (!producto) {
          return 0;
        } else {
          //Si existe el producto, busco el carrito con ese id.
          let carrito = await cartsModel.findOne({ _id: cid });
          //findOne devuelve un objeto. En cambio find devuelve un vector.
          console.log(carrito);
          if (!carrito) {
            return 1;
          }
          console.log("casi");
          console.log(carrito.products);
          //Verifico si ya está ese producto en el carrito.
          //Me da la ubicación del producto en el vector products (dentro del carrito elegido).
          let indiceProducto = carrito.products.findIndex((p) => p._id === pid);
          console.log(indiceProducto);

          let vectorProductos = carrito.products; //Guardo los productos que tenía.

          if (indiceProducto === -1) {
            //Si no estaba el producto.
            if (!quantity) {
              quantity = 1;
            }
            producto.quantity = quantity;
            console.log(producto.quantity);
            carrito.products.push(pid); //Agrego el producto.
            vectorProductos = carrito.products; //Actualizo el vector de productos.
            console.log(vectorProductos);
            let carritoModificado = {
              products: vectorProductos,
            };
            console.log("carritoModificado: ", carritoModificado);
            //carrito.products.push({pid: pid, quantity: 1});
            await cartsModel.updateOne({ _id: cid }, carritoModificado);
          } else {
            carrito.products[indiceProducto].quantity++;
          }
        }
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
}
