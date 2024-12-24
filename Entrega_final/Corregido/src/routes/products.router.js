import { Router } from "express";
import fs from "fs";
//import productManager from "../services/productManager.js";
import productManager from "../services/productModelManager.js";
import { Server } from "socket.io";
import io from "../app.js";

const router = Router();

let products = []; //Uso let porque le voy a asignar valores.

const manager = new productManager(); //Hago una instancia de la clase manager.

//TRAE TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
  //Se pone async porque trabajamos con archivos.
  try {
    let limite = parseInt(req.query.limit);
    let pagina = parseInt(req.query.page);
    let orden = parseInt(req.query.sort);
    let categoria = req.query.category;
    let disponibilidad = parseInt(req.query.stock);

    const vector = await manager.listarProductos(
      limite,
      pagina,
      orden,
      categoria,
      disponibilidad
    );
    res.status(200).send({ status: "success", payload: vector });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", payload: {} });
  }
});

//TRAE EL PRODUCTO CON ESE id
router.get("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    const producto = await manager.mostrarProducto(id);
    if (!producto) {
      return res.status(404).send("No se ha encontrado ese producto.");
    }
    res.send(producto);
  } catch (error) {
    console.log(error);
  }
});

//CREA UN PRODUCTO
router.post("/", async (req, res) => {
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
    //console.log(nuevoProducto);
    if (!nuevoProducto) {
      res.status(400).send("Ya existe un producto con ese código.");
      return;
    }
    io.emit("new_product", nuevoProducto);
    //await manager.guardarArchivo(JSON.stringify(products)); //Lo guardo en agregarProducto()
    //res.send({ status: "Éxito", message: "Se ha creado el producto." });
    res.send({ status: "Éxito", producto: nuevoProducto });
    return;
  } catch (error) {
    console.log(error);
  }
});

//MODIFICA EL PRODUCTO CON ESE id
router.put("/:pid", async (req, res) => {
  try {
    let nuevosValores = req.body;
    let id = req.params.pid;
    const producto = await manager.modificarProducto(id, nuevosValores);
    if (!producto) {
      return res.status(404).send("No se ha encontrado ese producto.");
    }
    //res.send({ status: "Éxito", message: "Se ha modificado el producto." });
    res.send(producto);
  } catch (error) {
    console.log(error);
  }
});

//ELIMINA EL PRODUCTO CON ESE id
router.delete("/:pid", async (req, res) => {
  try {
    let id = req.params.pid;
    const productoBorrado = await manager.eliminarProducto(id);
    if (!productoBorrado) {
      return res.status(404).send("No se ha encontrado ese producto.");
    }
    //const resultado = await manager.borrarDeLosCarritos(id);
    //ESTA FUNCIÓN NO ANDA.
    res.send(productoBorrado);
  } catch (error) {
    console.log(error);
  }
});

export default router;
