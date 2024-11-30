import express from "express";
import __dirname from "./utils.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import { Server } from "socket.io"; //Este import es nuevo, este "Server" se creará a partir del server HTTP

const app = express();
const httpServer = app.listen(8080, () =>
  console.log("Listening on PORT 8080")
); //Sólo el Server HTTP

//¡Ahora algo nuevo! Creamos un servidor para sockets viviendo dentro de nuestro servidor principal.
const io = new Server(httpServer); //socketServer será un servidor para trabajar sockets.

//Configuramos todo lo referente a plantillas.
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/public"));
app.use("/", viewsRouter);

//Esto lo pongo por las dudas, no sé si hace falta.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let messages = []; //Los mensajes se almacenarán aquí.

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado.");
  socket.on("message", (data) => {
    //Nota cómo escucha al evento con el mismo nombre que el emit del cliente: "message"
    messages.push(data); //Guardamos el objeto en la "base".
    io.emit("messageLogs", messages); //Reenviamos instantáneamente los logs actualizados.
  });
});

//Ponemos a socketServer a "escuchar una conexión" (por si algo pasa) con .on
/* io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado."); //Cuando detecta que hay una nueva conexión (el cliente se conectó),
  //muestra el mensaje.
  //socket.on("message", data => ) significa "escuchar cuando el socket conectado envíe un evento tipo 'message'"
  socket.on("message", (data) => {
    console.log(data);
  }); //En cuanto se reciba un evento de tipo "message" con la 'data' que se envió, mostrarla por consola.
  socket.emit(
    "evento_para_socket_individual",
    "Este mensaje sólo lo debe recibir el socket que se acaba de conectar."
  );
  socket.broadcast.emit(
    "evento_para_todos_menos_el_socket_actual",
    "Este evento lo verán todos los sockets, menos el socket actual desde el que se envió el mensaje."
  );
  socketServer.emit(
    "evento_para_todos",
    "Este mensaje lo reciben todos los sockets conectados."
  );
});
 */
