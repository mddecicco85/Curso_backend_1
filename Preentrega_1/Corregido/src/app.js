//IMPORTO MÓDULOS Y CLASES
import express from "express";
import fs from "fs";
//const fs = require("fs");
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import __dirname from "./utils.js"; //En utils.js tengo esa librería.

//CREO LA APLICACIÓN
const app = express();

console.log(__dirname); //C:\Users\Usuario\Documents\Martín\CODERHOUSE\Curso_backend_1\Preentrega_1\src

//PARA QUE LOS RECURSOS DE LA CARPETA public SEAN ESTÁTICOS
//app.use(express.static("./public")); //Puse la carpeta public dentro de src.
//app.use(express.static("../public")); //Esto indicaba que public estba en la carpeta padre de la carpeta src,
//donde estaba la app.js. Ya lo cambié.
app.use(express.static(__dirname + "/public"));

//Para recibir datos complejos desde la url, y mensajes de tipo JSON en formato urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use("/api/products/", productsRouter);
app.use("/api/carts/", cartsRouter);

//DEFINO EL PUERTO
const puerto = 8080;

app.listen(puerto, () => console.log(`Escuchando en puerto ${puerto}.`));
