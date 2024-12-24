import mongoose from "mongoose";
import productsModel from "./models/products.js";

export default class productManager {
  async listarProductos(limit, page, sort, category, stock) {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        //console.log("Conectado_listar.");
        if (!limit || limit === 0) {
          limit = 10;
        }
        if (!page || page <= 0) {
          page = 1;
        }
        if (!sort || (sort !== 1 && sort !== -1)) {
          sort = 0;
        }

        let productos = [];

        if (!category) {
          //Si no ingresó la categoría.
          if (sort === 0) {
            //Si no ingresó valor, o valor válido, no ordeno.
            if (stock === 1) {
              //Quiero los que tienen stock.
              productos = await productsModel.paginate(
                { stock: { $gt: 0 } },
                { limit: limit, page: page }
              );
            } else if (stock === 0) {
              //Quiero los que están agotados.
              productos = await productsModel.paginate(
                { stock: { $eq: 0 } },
                { limit: limit, page: page }
              );
            } else {
              //Si no especifica, que liste todos.
              productos = await productsModel.paginate(
                {},
                { limit: limit, page: page }
              );
            }
          } else {
            //Si ingresó sort = 1 o -1
            if (stock === 1) {
              //Quiero los que tienen stock.
              productos = await productsModel.paginate(
                { stock: { $gt: 0 } },
                { limit: limit, page: page, sort: { price: sort } }
              );
            } else if (stock === 0) {
              //Quiero los que están agotados.
              productos = await productsModel.paginate(
                { stock: { $eq: 0 } },
                { limit: limit, page: page, sort: { price: sort } }
              );
            } else {
              //Si no especifica, que liste todos.
              productos = await productsModel.paginate(
                {},
                { limit: limit, page: page, sort: { price: sort } }
              );
            }
          }
        } else {
          //Si ingresó la categoría.
          if (sort === 0) {
            //Si no ingresó valor, o valor válido, no ordeno.
            if (stock === 1) {
              //Quiero los que tienen stock.
              productos = await productsModel.paginate(
                { category: category, stock: { $gt: 0 } },
                { limit: limit, page: page }
              );
            } else if (stock === 0) {
              //Quiero los que están agotados.
              productos = await productsModel.paginate(
                { category: category, stock: { $eq: 0 } },
                { limit: limit, page: page }
              );
            } else {
              //Si no especifica, que liste todos.
              productos = await productsModel.paginate(
                { category: category },
                { limit: limit, page: page }
              );
            }
          } else {
            //Si ingresó sort = 1 o -1
            if (stock === 1) {
              //Quiero los que tienen stock.
              productos = await productsModel.paginate(
                { category: category, stock: { $gt: 0 } },
                { limit: limit, page: page, sort: { price: sort } }
              );
            } else if (stock === 0) {
              //Quiero los que están agotados.
              productos = await productsModel.paginate(
                { category: category, stock: { $eq: 0 } },
                { limit: limit, page: page, sort: { price: sort } }
              );
            } else {
              //Si no especifica, que liste todos.
              productos = await productsModel.paginate(
                { category: category },
                { limit: limit, page: page, sort: { price: sort } }
              );
            }
          }
        }

        console.log(productos);

        if (productos.length == 0) {
          return null;
        } else {
          return productos;
        }
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
  }

  async mostrarProducto(id) {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        //console.log("Conectado_mostrar.");
        let producto = await productsModel.findOne({ _id: id });
        if (!producto) {
          return null;
        } else {
          return producto;
        }
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
  }

  async agregarProducto(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    //VALIDA SI YA EXISTE EL PRODUCTO MEDIANTE EL CÓDIGO.
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        //console.log("Conectado_agregar.");
        //console.log(code);
        let products = await productsModel.find({ code: code });
        //products es un vector porque find() siempre devuele un array (aunque esté vacío)
        if (products.length > 0) {
          console.log("Producto ya existente.");
          return null;
        } else {
          const nuevoProducto = {
            title: title,
            description: description,
            code: code,
            price: price,
            status: status,
            stock: stock,
            category: category,
            thumbnails: thumbnails,
          };
          //console.log(category);
          let result = await productsModel.create(nuevoProducto);
          //console.log(nuevoProducto);
          //await this.guardarArchivo(); //Guardo los cambios en el archivo.
          return result;
        }
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
    //Si no pongo este return, la función agregarProducto no devuelve nada, aunque sí devuelva connectMongoDB.
  }

  async modificarProducto(id, nuevosValores) {
    const connectMongoDB = async () => {
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        let producto = await productsModel.find({ _id: id });
        if (!producto) {
          return null;
        } else {
          await productsModel.updateOne({ _id: id }, nuevosValores);
          producto = await productsModel.find({ _id: id }); //SIN ESTO, LO DEVUELVE SIN MODIFICAR.
          return producto;
        }
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
  }

  async eliminarProducto(id) {
    const connectMongoDB = async () => {
      //console.log(id);
      try {
        await mongoose.connect(
          "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
        );
        let producto = await productsModel.findOne({ _id: id });
        if (!producto) {
          return null;
        } else {
          await productsModel.deleteOne({ _id: id });
          return { status: "success", producto };
        }
      } catch (error) {
        console.log(error);
        process.exit();
      }
    };
    return await connectMongoDB();
  }
}
