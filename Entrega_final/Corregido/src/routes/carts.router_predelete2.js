import { Router } from "express";
//import fs from "fs";
//import cartManager from "../services/cartManager.js";
import cartManager from "../services/cartModelManager.js";

const router = Router();

let carts = []; //Este vector tiene todos los carrito creados.

const manager = new cartManager(); //Hago una instancia de la clase manager.

//PARA VER TODOS LOS CARRITOS (NO SE PIDE EN LA CONSIGNA).
router.get("/", async (req, res) => {
  try {
    const carritos = await manager.listarCarritos();
    //console.log(carritos);
    res.json(carritos);
  } catch (error) {
    console.log(error);
  }
});

//TRAE EL CARRITO CON ESE id
router.get("/:cid", async (req, res) => {
  try {
    let id = req.params.cid;
    const carrito = await manager.mostrarCarrito(id);
    if (!carrito) {
      return res.status(404).send("No se ha encontrado ese carrito.");
    }
    //res.json(carrito);
    res.send(carrito);
    //res.json(carrito.products); //Si está vacío, no aparece []
    //res.send(carrito.products);
  } catch (error) {
    console.log(error);
  }
});

//PARA VACIAR UN CARRITO
router.delete("/:cid", async (req, res) => {
  try {
    let id = req.params.cid;
    let carrito = await manager.mostrarCarrito(id);
    if (!carrito) {
      return res.status(404).send("No se ha encontrado ese carrito.");
    } else {
      carrito = await manager.vaciarCarrito(id);
    }
    res.send(carrito);
  } catch (error) {
    console.log(error);
  }
});

//PARA SETEAR UN CARRITO
router.put("/:cid", async (req, res) => {
  try {
    let id = req.params.cid;
    let vectorProductos = req.body;
    //console.log(vectorProductos);
    let carrito = await manager.mostrarCarrito(id);
    if (!carrito) {
      return res.status(404).send("No se ha encontrado ese carrito.");
    } else {
      carrito = await manager.setearCarrito(id, vectorProductos);
    }
    res.send(carrito);
  } catch (error) {
    console.log(error);
  }
});

//PARA CREAR UN NUEVO CARRITO
router.post("/", async (req, res) => {
  try {
    const nuevoCarrito = await manager.agregarCarrito();
    //res.json(nuevoCarrito);
    res.send({ status: "Éxito", carrito: nuevoCarrito });
    //res.send({ status: "Éxito", message: "Se ha creado el producto." });
  } catch (error) {
    console.log();
  }
});

//PARA AGREGAR UN PRODUCTO A UN CARRITO DADO (SÓLO EL id Y LA CANTIDAD)
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const respuesta = await manager.agregarAlCarrito(
      req.params.cid,
      req.params.pid,
      req.body.quantity
    );
    //console.log(respuesta);
    if (respuesta === 0) {
      return res.status(404).send("No existe un producto con ese id.");
    } else if (respuesta === 1) {
      return res.status(404).send("No existe un carrito con ese id.");
    }
    res.json(respuesta);
  } catch (error) {
    console.log(error);
  }
});

export default router;
