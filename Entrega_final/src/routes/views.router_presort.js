import express from "express";
import mongoose from "mongoose";
import productsModel from "../services/models/products.js";

const router = express.Router();

//let products;

const connectMongoDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mddecicco85:f5vdeijp0bc6hkse@cluster-integrador.8mf0a.mongodb.net/negocio?retryWrites=true&w=majority&appName=Cluster-integrador"
    );
    let products = await productsModel.find();
    return products;
  } catch (error) {
    console.log(error);
    process.exit();
  }
};
//connectMongoDB();

/* fetch("http://localhost:8080/api/products")
.then((response) => response.json())
.then((data) => products = data); */

router.get("/products", async (req, res) => {
  try {
    let limite = parseInt(req.query.limit);
    let pagina = parseInt(req.query.page);
    let orden = parseInt(req.query.sort);
    if (!limite || limite === 0) {
      limite = 10;
    }
    /* if (!pagina || pagina <= 0) {
    pagina = 1;
  } */
    if (isNaN(orden) || (orden !== 1 && orden !== -1)) {
      orden = 0;
    }
    /* if (!orden || orden !== 1 || orden !== 1) {
      orden = 0;
    } */
    let products = await connectMongoDB();
    //products = products.map((product) => product.toObject());

    products = await productsModel.paginate(
      //El primero es el filtro.
      {},
      { limit: limite, page: pagina, sort: { price: orden }, lean: true }
    );

    //Navegabilidad
    products.prevLink = products.hasPrevPage
      ? `http://localhost:8080/products/?page=${products.prevPage}&limit=${limite}&sort=${orden}`
      : "";
    products.nextLink = products.hasNextPage
      ? `http://localhost:8080/products/?page=${products.nextPage}&limit=${limite}&sort=${orden}`
      : "";

    //Valido los extremos de las páginas.
    products.isValid = !(pagina <= 0 || products.page > products.totalPages);

    console.log(products);
    res.render("products", {
      style: "index.css",
      //products, //Si lo paso así, no anda. Ver Coplilot.
      isValid: products.isValid,
      docs: products.docs,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.prevLink,
      nextLink: products.nextLink,
      page: products.page,
    }); //(nombre de la plantilla, objeto a reemplazar)
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "error", message: "Error del servidor." });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  let products = await connectMongoDB();
  products = products.map((product) => product.toObject());
  //console.log(products);
  res.render("realTimeProducts", {
    style: "index.css",
    products,
  }); //(nombre de la plantilla, objeto a reemplazar)
});

export default router;
