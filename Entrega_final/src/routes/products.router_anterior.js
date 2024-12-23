import { Router } from "express";
import fs from "fs";
//import productManager from "../services/productManager.js";
import productManager from "../services/productModelManager.js";

const router = Router();

let products = []; //Uso let porque le voy a asignar valores.

const manager = new productManager(); //Hago una instancia de la clase manager.

//TRAE TODOS LOS PRODUCTOS
router.get("/", async (req, res) => {
  //Se pone async porque trabajamos con archivos.
  try {
    let limite = parseInt(req.query.limit);
    /* if (!limite || limite === 0) {
      limite = undefined; //Si no puse el límite en la URL, lo dejo como indefinido.
    } */
    const vector = await manager.listarProductos(limite);
    res.send(vector);
  } catch (error) {
    console.log(error);
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
    /* if (!title || !description || !code || !price || !stock || !category) {
      //thumbnails no es obligatorio
      return res
        .status(400)
        .send("Debe completar todos los campos (thumbnails es opcional).");
    } */
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
    console.log(nuevoProducto);
    if (!nuevoProducto) {
      res.status(400).send("Ya existe un producto con ese código.");
      return;
    }

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
    //borrarDeLosCarritos(id);
    res.send(productoBorrado);
  } catch (error) {
    console.log(error);
  }
});

//QUEDARÍA POR HACER QUE UN PRODUCTO ELIMINADO SE BORRARA DE TODOS LOS CARRITOS EN QUE ESTUVIESE.
let carts = [];

async function borrarDeLosCarritos(pid) {
  try {
    let carritosJSON = await fs.promises.readFile("./carrito.json", "utf-8"); //Si había carritos, los carga.
    carts = JSON.parse(carritosJSON); //carts es un vector.
    carts.forEach((c) => {
      console.log("hola");
      //c es un objeto.
      for (let i = 0; i < c.products.length; i++) {
        //c.products es un vector.
        if (c.products[i].pid === pid) {
          //c.products[i] es un objeto.
          c.products.splice(i, 1);
        }
      }
    });
    const dataJSON = JSON.stringify(carts, null, 2);
    await fs.promises.writeFile("./carrito.json", dataJSON);
  } catch (error) {
    console.log(error);
  }
}

export default router;
