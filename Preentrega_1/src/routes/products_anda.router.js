import { Router } from "express";

const router = Router();

let products = []; //Uso let porque le voy a asignar valores.

//TRAE TODOS LOS PRODUCTOS
router.get("/", (req, res) => {
  //Cuerpo del servicio para GET products
  res.send(products); //FALTA LO DE LIMIT!!!!!!!!!!!!!!!!!!!!!!!
});

//TRAE EL PRODUCTO CON ESE id
router.get("/:pid", (req, res) => {
  try {
    let id = parseInt(req.params.pid);
    //let producto = products.filter((p) => p.id === id);
    let indice = products.findIndex((p) => p.id === id);
    if (indice === -1) {
      return res.status(404).send("No se ha encontrado ese producto.");
    }
    res.send(products[indice]);
  } catch (error) {}
});

router.post("/", (req, res) => {
  //let nuevoProducto = req.body;
  let { title, description, code, price, status, stock, category, thumbnails } =
    req.body; //Desestructuro para crear las variables a partir de las homónimas de req.body
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
  const nuevoProducto = {
    id: Math.floor(Math.random() * 1000 + 1),
    title: title,
    description: description,
    code: code,
    price: price,
    status: status,
    stock: stock,
    category: category,
    thumbnails: thumbnails,
  };
  products.push(nuevoProducto);
  res.send({ status: "Éxito", message: "Se ha creado el producto." });
});
//Asignamos id
//Validamos
//Cargamos en el array
//Retornamos

router.put("/:pid", (req, res) => {
  let id = parseInt(req.params.pid);
  //let producto = products.filter((p) => p.id === id);
  let indice = products.findIndex((p) => p.id === id);
  if (indice === -1) {
    return res.status(404).send("No se ha encontrado ese producto.");
  }
  let nuevosValores = req.body;
  products[indice] = { id: id, ...nuevosValores }; //Conservo el id, y copio todo el otro objeto seguido.
  //let productoModificado = req.body;
  //productoModificado.id = id; //Me agrega el campo al final, no al principio.
  //products[indice] = productoModificado; //Desaparece el campo id al sobreescribir. OJO!!!
  res.send({ status: "Éxito", message: "Se ha modificado el producto." });
});

router.delete("/:pid", (req, res) => {
  let id = parseInt(req.params.pid);
  //let producto = products.filter((p) => p.id === id);
  let indice = products.findIndex((p) => p.id === id);
  if (indice === -1) {
    return res.status(404).send("No se ha encontrado ese producto.");
  }
  products.splice(indice, 1);
  //res.send({indice});
  res.send({ status: "Éxito", message: "Se ha eliminado el producto." });
});

export default router;
