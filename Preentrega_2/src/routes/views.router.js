import express from "express";
import productManager from "../services/productManager.js";

const router = express.Router();
const manager = new productManager();

/* let products = [
  {
    title: "Hamburguesa",
    description: "comida",
    code: "570294jf0",
    price: "100",
    sotck: "2",
  },
  {
    title: "Banana",
    description: "comida",
    code: "5jf034f",
    price: "200",
    sotck: "7",
  },
  {
    title: "Pera",
    description: "comida",
    code: "57fj2few",
    price: "300",
    sotck: "5",
  },
  {
    title: "Papas",
    description: "comida",
    code: "ffhfigg",
    price: "100",
    sotck: "2",
  },
]; */

let products = [];

fetch("http://localhost:8080/api/products")
.then((response) => response.json())
.then((data) => products = data);


/* //CREA UN PRODUCTO
router.post("/", (req, res) => {
  try {
    let { title, description, code, price, stock } = req.body; //Desestructuro para crear las variables a partir de las homónimas de req.body
    if (!title || !description || !code || !price || !stock) {
      return res.status(400).send("Debe completar todos los campos.");
    }
    let yaExiste = this.products.filter((p) => p.code === code);
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
    this.products.push(nuevoProducto);
    io.on("connection", (socket) => {
      socket.emit("add_product", this.products);
    });
    res.send({ status: "Éxito", message: "Se ha creado el producto." });
  } catch (error) {
    console.log(error);
  }
}); */

router.get("/products", (req, res) => {
  res.render("products", {
    style: "index.css",
    products,
  }); //(nombre de la plantilla, objeto a reemplazar)
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", {
    style: "index.css",
    products,
  }); //(nombre de la plantilla, objeto a reemplazar)
});

export default router;
