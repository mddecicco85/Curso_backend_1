const socket = io(); //Instanciamos el socket y lo guardamos en esa constante.
//Este es el socket del CLIENTE.

let listado = document.getElementById("productos");

socket.on("new_product", (data) => {
  //console.log(data);
  //data va a recibir el último producto del vector.
  const idString = data._id.toString(); //Si no lo convierto, no anda (para el caso en que cargo todos)
  let nuevo_div = document.createElement("div");
  nuevo_div.setAttribute("id", idString);

  nuevo_div.innerHTML = `<p>${data.title}</p><br>
       <p>${data.description}</p><br>
       <p>$${data.price}</p><br>
       <p>Stock:${data.stock}</p><br>
       <button id="btn_${idString}">Eliminar</button><br>
       <p>-------------------------</p>`;
  listado.appendChild(nuevo_div);
  const boton_eliminar = document.getElementById(`btn_${idString}`);
  boton_eliminar.addEventListener("click", () => {
    socket.emit("delete_product", { _id: idString });
  });
});

/* socket.on("producto_eliminado", (data) => {
  const idString = data._id.toString(); //Si no lo convierto, no funciona.
  let product_div = document.getElementById(idString);
  listado.removeChild(product_div);
  //product_div.innerHTML = "";
}); */

socket.on("producto_eliminado", (data) => {
  const idString = data._id.toString();
  console.log(`Producto eliminado con ID: ${idString}`);
  let product_div = document.getElementById(idString);
  if (product_div) {
    listado.removeChild(product_div);
  } else {
    console.error(`No se encontró el producto con ID: ${idString}`);
  }
});

console.log("Hola, estoy ejecutando un script desde una plantilla.");
