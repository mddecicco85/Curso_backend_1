import fs from "fs";

export default class cartManager {
  constructor() {
    (this.carts = []), this.inicializar();
  }

  //ESTA FUNCIÓN REVISA SI HAY CARRITOS GUARDADOS EN EL ARCHIVO.
  async inicializar() {
    try {
      let carritosJSON = await fs.promises.readFile("./carrito.json", "utf-8"); //Si había carritos, los carga.
      this.carts = JSON.parse(carritosJSON);
    } catch (error) {
      this.carts = []; //Si no había, lo pone vacío (no sé si es necesario porque ya estaba vacío).
    }
  }

  //PARA VER TODOS LOS CARRITOS (NO SE PIDE EN LA CONSIGNA).
  async listarCarritos() {
    return this.carts;
  }

  //FUNCIÓN PARA VER EL CARRITO CON ESE id
  async mostrarCarrito(id) {
    //let carrito = this.carts.filter((c) => c.id === id); //Esto no sirve porque siempre devuelve uno.
    //Si no existe, devuelve uno vacío.
    let indice = this.carts.findIndex((c) => c.id === id);
    let carrito = this.carts[indice];
    //console.log(carrito);
    return carrito;
  }

  //FUNCIÓN QUE AGREGA UN PRODUCTO AL CARRITO.
  async agregarAlCarrito(cid, pid) {
    try {
      let productosJSON = await fs.promises.readFile(
        "./productos.json",
        "utf-8"
      ); //Si había productos guardados, los carga.
      const productos = JSON.parse(productosJSON);
      //Busco el producto con ese id.
      let producto = productos.filter((p) => p.id === pid);
      console.log("hola", producto);
      if (producto.length === 0) {
        //Con (!producto) no funciona, lo toma igual cuando viene vacío.
        return 0;
      }
      //Si existe el producto, busco el carrito con ese id.
      let indice = this.carts.findIndex((c) => c.id === cid); //Me da la ubicación del carrito en el vector.
      if (indice === -1) {
        return 1;
      }
      //Verifico si ya está ese producto en el carrito.
      //Me da la ubicación del producto en el vector products (dentro del carrito elegido).
      let indiceProducto = this.carts[indice].products.findIndex(
        (p) => p.pid === pid
      );
      if (indiceProducto === -1) {
        this.carts[indice].products.push({ pid: pid, quantity: 1 });
      } else {
        this.carts[indice].products[indiceProducto].quantity++;
      }
      await this.guardarArchivo(); //Guardo los cambios en el archivo.
      return producto;
    } catch (error) {
      return null; //Si no había productos, lo pone vacío.
    }
  }

  //FUNCIÓN QUE CREA O SOBREESCRIBE EL ARCHIVO CON LOS CARRITOS.
  async guardarArchivo() {
    try {
      const dataJSON = JSON.stringify(this.carts, null, 2);
      await fs.promises.writeFile("./carrito.json", dataJSON);
      console.log("Escritura exitosa.");
    } catch (error) {
      console.log(`Error de escritura: ${error}`);
    }
  }

  async agregarCarrito() {
    const nuevoCarrito = {
      id: Math.floor(Math.random() * 10000 + 1),
      products: [],
    };
    this.carts.push(nuevoCarrito);
    console.log(this.carts);
    await this.guardarArchivo(); //Guardo los cambios en el archivo.
    return nuevoCarrito;
  }
}
