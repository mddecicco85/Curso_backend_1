const socket = io();

/* io hace referencia a "socket.io", se le llama así por convención.
 * La línea 1 permite instanciar socket y guardarlo en la constante "socket".
 * Dicho socket es el que utilizaremos para poder comunicarnos con el socket del servidor.
 * (Recuerda que en este punto somos "clientes", porque representamos una vista). */

let user; //Este"user" será con el que el cliente se identificará para que se sepa quién escribió el mensaje.

let chatBox = document.getElementById("chatBox"); //Obtenemos la referencia del cuadro donde se escribirá.

Swal.fire({
  title: "Identifícate",
  input: "text", //Indicamos que el cliente necesita escribir un texto para poder avanzar de ese alerta.
  text: "Ingresa el usuario para identificarte en el chat",
  inputValidator: (value) => {
    return !value && "¡Necesitas escribir un nombre de usuario para continuar!"; //Esta validación
    //ocurre si el usuario decide dar en "continuar" sin haber colocado un nombre de usuario.
  },
  allowOutsideClick: false, //Impide que el usuario salga del alerta al dar "click" fuera del alerta.
}).then((result) => {
  user = result.value; //Una vez que el usuario se identifica, lo asignamos a la variable user.
});

chatBox.addEventListener("keyup", (evt) => {
  if (evt.key === "Enter") {
    //El mensaje se enviará cuando el usuario apriete "Enter" en la caja de chat.
    if (chatBox.value.trim().length > 0) {
      //Corroboramos que el mensaje no esté vacío, o sólo contenga espacios.
      socket.emit("message", { user: user, message: chatBox.value }); //Emitimos nuestro primer evento.
      chatBox.value = "";
    }
  }
});

socket.on("messageLogs", (data) => {
  let log = document.getElementById("messageLogs");
  let messages = "";
  data.forEach((message) => {
    messages = messages + `${message.user} dice: ${message.message}<br>`;
    log.innerHTML = messages;
  });
});

/* socket.emit("message", "¡Hola, me estoy comunicando desde un websocket.");

socket.on("evento_para_socket_individual", (data) => {
  console.log(data);
});
socket.on("evento_para_todos_menos_el_socket_actual", (data) => {
  console.log(data);
});
socket.on("evento_para_todos", (data) => {
  console.log(data);
}); */
