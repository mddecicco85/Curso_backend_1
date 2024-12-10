//IMPORTO MÓDULOS Y CLASES
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

//console.log(__dirname); //C:\Users\Usuario\Documents\Martín\CODERHOUSE\Curso_backend_1\Preentrega_2\src

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
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

const httpServer = app.listen(8080, () =>
  console.log("Listening on PORT 8080")
); //Sólo el server HTTP

const io = new Server(httpServer); //socket del SERVIDOR

let products = [];

io.on("connection", async (socket) => {
  //Escucha la conexión de un nuevo socket.
  console.log("Nuevo cliente conectado.");

  app.post("/", async (req, res) => {
    try {
      let {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails,
      } = req.body; //Desestructuro para crear las variables a partir de las homónimas de req.body
      if (!title || !description || !code || !price || !stock || !category) {
        //thumbnails no es obligatorio
        return res
          .status(400)
          .send("Debe completar todos los campos (thumbnails es opcional).");
      }
      //SI NO LE PUSO STATUS LO ASIGNO COMO TRUE
      if (status !== false) {
        //No es exactamente lo que pide.
        status = true;
      }
      const nuevoProducto = await manager.agregarProducto(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      );
      if (!nuevoProducto) {
        res.status(400).send("Ya existe un producto con ese código.");
      }

      io.emit("new_product", nuevoProducto);

      res.send({ status: "Éxito", message: "Se ha creado el producto." });
    } catch (error) {
      console.log(error);
    }
  });

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
