import type { Server } from "bun";
import { Webview } from "webview-bun";
import { firstTimeInstall } from "./utils/setup";



type Command = {
    command: string,
    callback: any
}

class Lepton {
    commands: Record<string, Command> = {};
    server: Server
    webview: Webview | undefined
    constructor() {
        firstTimeInstall();
        this.server = Bun.serve({
            fetch(req, server) {
                // upgrade the request to a WebSocket
                if (server.upgrade(req)) {
                    return; // do not return a Response
                }
                return new Response("Upgrade failed :(", { status: 500 });
            },
            websocket: {
                // this is called when a message is received
                async message(ws, message) {
                    console.log(`Received ${message}`);
                    // send back a message
                    ws.send(`You said: ${message}`);
                },
            },
        });
        this.commands = {}
    }
    on(command: string, callback: any) {
        if (this.commands[command]) {
            throw new Error(`Command ${command} already exists`)
        }
        this.commands[command] = { command, callback }
    }
    send(command: string, data: any) {
        // this.server.ws.send(command, data)
    }
    windowInit(width: number, height: number, title: string, path: string) {

        this.webview = new Webview();

        this.webview.setHTML(path);
        this.webview.run();
    }
}