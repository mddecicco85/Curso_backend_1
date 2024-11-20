import { Router } from "express";
import fs from "fs";
import productManager from "../services/productManager";

const router = Router();

let products = []; //Uso let porque le voy a asignar valores.

const manager = new productManager();

//TRAE TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
  //Se pone async porque trabajamos con archivos.
  try {
    let limite = parseInt(req.query);
    if (!limite) {
      limite = undefined; //Si no puse el límite en la URL, lo dejo como indefinido.
    }
    const vector = await manager.listarProductos(limite);
    res.send(vector);
  } catch (error) {
    console.log(error);
  }
});

//TRAE EL PRODUCTO CON ESE id
router.get("/:pid", async (req, res) => {
  try {
    let id = parseInt(req.params.pid);
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
    if (!title || !description || !code || !price || !stock || !category) {
      //thumbnails no es obligatorio
      return res
        .status(400)
        .send("Debe completar todos los campos (thumbnails es opcional).");
    }
    //VALIDAR SI YA EXISTE EL PRODUCTO MEDIANTE EL CÓDIGO O TITLE
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

    //await manager.guardarArchivo(JSON.stringify(products));
    res.send({ status: "Éxito", message: "Se ha creado el producto." });
  } catch (error) {
    console.log(error);
  }
});

//MODIFICA EL PRODUCTO CON ESE id
router.put("/:pid", async (req, res) => {
  try {
    let nuevosValores = req.body;
    let id = parseInt(req.params.pid);
    const producto = await manager.manager.modificarProducto(id, nuevosValores);
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
    let id = parseInt(req.params.pid);
    const productoBorrado = await manager.eliminarProducto(id);
    if (!productoBorrado) {
      return res.status(404).send("No se ha encontrado ese producto.");
    }
    res.send(productoBorrado);
  } catch (error) {
    console.log(error);
  }
});

export default router;
