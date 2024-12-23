const socket = io(); //Instanciamos el socket y lo guardamos en esa constante.
//Este es el socket del CLIENTE.

let listado = document.getElementById("productos");

socket.on("new_product", (data) => {
  //console.log(data);
  //data va a recibir el último producto del vector.
  //let listado = document.getElementById("product_list");
  let nuevo_div = document.createElement("div");
  nuevo_div.setAttribute("id", `${data.id}`);

  nuevo_div.innerHTML = `<p>${data.title}</p><br>
       <p>${data.description}</p><br>
       <p>$${data.price}</p><br>
       <p>Stock:${data.stock}</p><br>
       <button id="btn_${data.id}">Eliminar</button><br>
       <p>-------------------------</p>`;
  listado.appendChild(nuevo_div);
  const boton_eliminar = document.getElementById(`btn_${data.id}`);
  boton_eliminar.addEventListener("click", () => {
    console.log("hola");
    socket.emit("delete_product", data);
  });
  //localStorage.setItem("productos", JSON.stringify(products));
});

socket.on("producto_eliminado", (data) => {
  let product_div = document.getElementById(`${data.id}`);
  listado.removeChild(product_div);
  //product_div.innerHTML = "";
});

console.log("Hola, estoy ejecutando un script desde una plantilla.");
