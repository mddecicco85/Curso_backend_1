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
  let products = await connectMongoDB();
  products = products.map((product) => product.toObject());
  //console.log(products);
  res.render("products", {
    style: "index.css",
    products,
  }); //(nombre de la plantilla, objeto a reemplazar)
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
