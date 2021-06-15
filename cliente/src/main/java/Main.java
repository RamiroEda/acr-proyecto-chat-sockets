import io.socket.client.IO;
import io.socket.client.Socket;
import io.socket.emitter.Emitter;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.net.URI;
import java.util.Scanner;

/**
 * Formato de los JSONs
 * interface Mensaje {
 *     id: string;
 *     usuarioId: string;
 *     usuarioNombre: string;
 *     enviado: Date;
 *     texto: string;
 * }
 *
 * interface Usuario {
 *     id: string;
 *     nombre: string;
 * }
 */

public class Main {
    public static void main(String[] args){
        Scanner in = new Scanner(System.in);
        Socket socket = IO.socket(URI.create("ws://localhost:3000"));

        socket.on("mensaje", objetos -> {
            JSONObject mensaje = (JSONObject) objetos[0];
            // Aqui entra un nuevo mensaje
            System.out.println(mensaje);
        });
        socket.on("entrar_chat", objetos -> {
            JSONArray usuarios = (JSONArray) objetos[0];
            // Aqui entra un usuario incluyendote
            System.out.println(usuarios);
        });
        socket.connect();

        socket.emit("entrar_chat", "Ramiro"); //Cambiar el nombre de usuario para que pueda entrar quien quiera
        while (true){
            String mensaje = in.nextLine();
            socket.emit("mensaje", mensaje);
        }
    }
}
