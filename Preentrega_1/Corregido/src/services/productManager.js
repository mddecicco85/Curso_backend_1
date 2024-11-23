//import fs from 'fs/promises';
import fs from "fs"; //Prefiero usarlo así.

//import path from "path"; //No la voy a usar. Lo hice de otra forma.

export default class productManager {
  constructor() {
    this.products = []; //Lo creo vacío.
    this.inicializar();
  }

  //ESTA FUNCIÓN REVISA SI HAY PRODUCTOS GUARDADOS EN EL ARCHIVO.
  async inicializar() {
    try {
      //this.products = this.leerArchivo();
      let productosJSON = await fs.promises.readFile(
        "./productos.json",
        "utf-8"
      ); //Si había, los carga.
      this.products = JSON.parse(productosJSON);
    } catch (error) {
      this.products = []; //Si no había productos, lo pone vacío.
    }
  }

  //FUNCIÓN QUE CREA O SOBREESCRIBE EL ARCHIVO CON LOS PRODUCTOS.
  async guardarArchivo() {
    try {
      const dataJSON = JSON.stringify(this.products, null, 2);
      await fs.promises.writeFile("./productos.json", dataJSON);
      console.log("Escritura exitosa.");
    } catch (error) {
      console.log(`Error de escritura: ${error}`);
    }
  }

  //FUNCIÓN PARA LEER EL ARCHIVO CON LOS PRODUCTOS.
  async leerArchivo() {
    try {
      let productosJSON = await fs.promises.readFile(
        "./productos.json",
        "utf-8"
      );
      //console.log(productosJSON);
      //console.log(typeof productosJSON);
      //console.log("Lectura exitosa.");
      let productosObjeto = JSON.parse(productosJSON);
      //console.log(productosObjeto);
      //console.log(typeof productosObjeto);
      //console.log("El contenido es el siguiente:", productosObjeto); //No anda con `` y ${dataObjeto}. Sale vacío.
      return productosObjeto;
    } catch (error) {
      console.log(`Error de lectura: ${error}`);
    }
  }

  async listarProductos(limit) {
    if (limit) {
      //Desde el primer elemento, copia hasta el elemento limit - 1.
      //Slice devuelve una copia, no modifica el original.
      return this.products.slice(0, limit); //Si limit > products.length, lo copia todo.
    } else {
      //Si no pusieron límite, devuelvo el vector completo.
      return this.products;
      //No necesito leer el archivo porque el vector ya está en memoria.
    }
  }

  async mostrarProducto(id) {
    let producto = this.products.filter((p) => p.id === id);
    return producto;
    /* let indice = products.findIndex((p) => p.id === id);
    if (indice === -1) {
      return undefined;
    } else {
    return products[indice];
    } */
  }

  async agregarProducto(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails
  ) {
    //VALIDA SI YA EXISTE EL PRODUCTO MEDIANTE EL CÓDIGO.
    let yaExiste = this.products.filter((p) => p.code === code);
    if (yaExiste.length > 0) {
      return null;
    }
    const nuevoProducto = {
      id: Math.floor(Math.random() * 10000 + 1),
      title: title,
      description: description,
      code: code,
      price: price,
      status: status,
      stock: stock,
      category: category,
      thumbnails: thumbnails,
    };
    this.products.push(nuevoProducto);
    await this.guardarArchivo(); //Guardo los cambios en el archivo.
    return nuevoProducto;
  }

  async modificarProducto(id, nuevosValores) {
    //let producto = this.products.filter((p) => p.id === id);
    let indice = this.products.findIndex((p) => p.id === id);
    if (indice === -1) {
      return null;
    }
    this.products[indice] = { id: id, ...nuevosValores }; //Conservo el id, y copio todo el otro objeto seguido.
    await this.guardarArchivo(); //Guardo en el archivo.
    return this.products[indice];
  }

  async eliminarProducto(id) {
    let indice = this.products.findIndex((p) => p.id === id);
    if (indice === -1) {
      return null;
    }
    //Desde el elemento indice, corta 1 elemento.
    //Splice modifica el original y devuelve un array con los elementos eliminados.
    const productoBorrado = this.products.splice(indice, 1);
    await this.guardarArchivo();
    return productoBorrado[0]; //Que tome el 1er elemento (igual debería haber uno solo).
  }
}
