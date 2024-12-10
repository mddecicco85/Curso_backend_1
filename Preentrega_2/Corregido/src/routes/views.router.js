import express from "express";

const router = express.Router();

let products = [];

fetch("http://localhost:8080/api/products")
.then((response) => response.json())
.then((data) => products = data);

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
