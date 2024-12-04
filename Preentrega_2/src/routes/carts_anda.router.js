import { Router } from "express";

const router = Router();

let carts = []; //Este vector tiene todos los carrito creados.

//PARA VER TODOS LOS CARRITOS (NO SE PIDE EN LA CONSIGNA).
router.get("/", (req, res) => {
  res.send(carts);
});

//PARA CREAR UN NUEVO CARRITO
router.post("/", (req, res) => {
  const nuevoCarrito = {
    id: Math.floor(Math.random() * 10000 + 1),
    products: [],
  };
  carts.push(nuevoCarrito);
  res.send({ status: "Éxito", message: "Se ha creado el carrito." });
});

//DEBE LISTAR TODOS LOS PRODUCTOS DE ESE CARRITO
router.get("/:cid", (req, res) => {
  try {
    let id = parseInt(req.params.cid);
    let indice = carts.findIndex((c) => c.id === id);
    if (indice === -1) {
      return res.status(404).send("No se ha encontrado ese carrito.");
    }
    res.send(carts[indice].products);
  } catch (error) {}
});

//PARA AGREGAR UN PRODUCTO A UN CARRITO DADO (SÓLO EL id Y LA CANTIDAD)
router.post("/:cid/product/:pid", (req, res) => {});

export default router;
