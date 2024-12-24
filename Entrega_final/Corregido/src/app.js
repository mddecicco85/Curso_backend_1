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
//import productManager from "./services/productManager.js";
import productManager from "./services/productModelManager.js";
//Lo voy a usar para guardar los cambios en productos.json

//CREO LA APLICACIÓN
const app = express();
const manager = new productManager();

//console.log(__dirname);

//PARA QUE LOS RECURSOS DE LA CARPETA public SEAN ESTÁTICOS
//app.use(express.static("./public")); //Puse la carpeta public dentro de src.
//app.use(express.static("../public")); //Esto indicaba que public estaba en la carpeta padre de la carpeta src,
//donde estaba la app.js. Ya lo cambié.
app.use(express.static(__dirname + "/public"));

//Para recibir datos complejos desde la url, y mensajes de tipo JSON en formato urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);

app.engine("handlebars", handlebars.engine());
//app.engine('handlebars', handlebars({ defaultLayout: 'main', runtimeOptions: { allowProtoPropertiesByDefault: true, } }));
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use("/", viewsRouter);

const httpServer = app.listen(8080, () =>
  console.log("Listening on PORT 8080")
); //Sólo el server HTTP

const io = new Server(httpServer); //socket del SERVIDOR

//let products = [];

io.on("connection", async (socket) => {
  //Escucha la conexión de un nuevo socket.
  console.log("Nuevo cliente conectado.");

  socket.on("delete_product", async (data) => {
    //data tiene el objeto/producto a eliminar
    //console.log(data);
    const idString = data._id.toString();
    await manager.eliminarProducto(idString);
    io.emit("producto_eliminado", data);
  });
});

export default io;
