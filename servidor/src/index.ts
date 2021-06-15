import express = require('express');
import http = require("http");
import socketio = require("socket.io");
import randomstring = require('randomstring');
import { emit } from 'process';

interface Mensaje {
    id: string;
    usuarioId: string;
    usuarioNombre: string;
    enviado: Date;
    texto: string;
}

interface Usuario {
    id: string;
    nombre: string;
}


const usuarios: Usuario[] = [];
const chatGlobal: Mensaje[] = [];


async function inicializarServidor() {
    const app = express();
    const server = new http.Server(app);
    const io = new socketio.Server(server);

    server.listen(3000, () => {
        console.log("http://localhost:3000/");
    });

    io.on("connection", function (socket: socketio.Socket) {
        console.log("Conectado");
        
        socket.on("entrar_chat", function (id: string) {
            console.log(`Entro: ${socket.id}`);
            
            usuarios.push({
                id: socket.id,
                nombre: id
            });
            io.emit("entrar_chat", [...usuarios]);
        });

        socket.on("mensaje", function (texto: string) {
            console.log(`Nuevo mensaje: ${texto}`);

            const mensaje: Mensaje = {
                id: randomstring.generate(),
                enviado: new Date(),
                texto: texto,
                usuarioId: socket.id,
                usuarioNombre: usuarios.find((usuario) => usuario.id === socket.id)?.nombre ?? "Desconocido"
            };
            
            chatGlobal.push(mensaje);
            
            io.emit("mensaje", mensaje);
        });
    
        socket.on("disconnect", () => {
            console.log(`Usuario desconectado`);
            for (let i = 0; i < usuarios.length; i++) {
                if (socket.id === usuarios[i].id) {
                    usuarios.splice(i, 1);
                    break;
                }
            }
        });
    });
}

inicializarServidor();