//IMPORTO MÓDULOS Y CLASES
import express from "express";
import fs from "fs";
//const fs = require("fs");
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js"; //En utils.js tengo esa librería.
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import productManager from "./services/productManager.js";
//Lo voy a usar para guardar los cambios en productos.json

//CREO LA APLICACIÓN
const app = express();
const manager = new productManager();

console.log(__dirname); //C:\Users\Usuario\Documents\Martín\CODERHOUSE\Curso_backend_1\Preentrega_1\src

//PARA QUE LOS RECURSOS DE LA CARPETA public SEAN ESTÁTICOS
app.use(express.static(__dirname + "/public"));

//Para recibir datos complejos desde la url, y mensajes de tipo JSON en formato urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

const httpServer = app.listen(8080, () =>
  console.log("Listening on PORT 8080")
); //Sólo el server HTTP

const io = new Server(httpServer); //socket del SERVIDOR

let products = [];
let lastEmittedProduct = null;

/* fetch("http://localhost:8080/api/products")
.then((response) => response.json())
.then((data) => products = data); */

//CREA UN PRODUCTO
/* app.post("/productos", (req, res) => {
  try {
    let { title, description, code, price, stock } = req.body; //Desestructuro para crear las variables a partir de las homónimas de req.body
    if (!title || !description || !code || !price || !stock) {
      return res.status(400).send("Debe completar todos los campos.");
    }
    let yaExiste = products.filter((p) => p.code === code);
    if (yaExiste.length > 0) {
      return res.status(400).send("Ya existe un producto con ese código.");
    }
    const nuevoProducto = {
      id: Math.floor(Math.random() * 10000 + 1),
      title: title,
      description: description,
      code: code,
      price: price,
      stock: stock,
    };
    products.push(nuevoProducto);
    //console.log(products);
    io.emit("new_product", products[products.length - 1]); //Le pasa el último producto creado.
    res.send({ status: "Éxito", message: "Se ha creado el producto." });
  } catch (error) {
    console.log(error);
  }
}); */

/* const getProducts = async () => {
  const response = await fetch("http://localhost:8080/api/products");
  let datos = await response.json();
  products = datos;
}; */

/* const getProducts = async () => {
  try {
    let response = await manager.listarProductos(); // Recibe el array directamente
    products = response; // Asigna el array directamente a products
    console.log(products); // Ahora products debería estar lleno de datos
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }
};
getProducts(); */

io.on("connection", async (socket) => {
  //Escucha la conexión de un nuevo socket.
  //console.log("Nuevo cliente conectado.")
  //products = await manager.listarProductos();
  //products = await manager.listarProductos();
  //console.log(products);
  //products = JSON.stringify(productsJSON);
  //console.log(products);
  let response = await fetch("http://localhost:8080/api/products");
  let data = await response.json();
  products = data;
  console.log(products);
  if (
    products.length > 0 &&
    lastEmittedProduct !== products[products.length - 1].id
  ) {
    lastEmittedProduct = products[products.length - 1].id;
    io.emit("new_product", products[products.length - 1]);
  }
  //io.emit("new_product", products[products.length - 1]);
  //console.log(products[products.length - 1]);
  socket.on("delete_product", async (data) => {
    //data tiene el objeto/producto a eliminar
    //console.log(data);
    //let indice = products.findIndex((p) => p.id === data.id);
    await manager.eliminarProducto(data.id);
    //products.splice(indice, 1); //Recorta ese producto.
    console.log(products);
    io.emit("producto_eliminado", data);
  });
});

//Con .on está escuchando por si se conecta algún socket, o por si algo pasa.
