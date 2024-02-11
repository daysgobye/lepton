import type { Server } from "bun";
import { SizeHint, Webview } from "webview-bun";
import { firstTimeInstall } from "./utils/setup";

export const enum SizeBehavior {
    /** Width and height are default size */
    NONE = SizeHint.NONE,
    /** Width and height are minimum bounds */
    MIN = SizeHint.MIN,
    /** Width and height are maximum bounds */
    MAX = SizeHint.MAX,
    /** Window size can not be changed by a user */
    FIXED = SizeHint.FIXED,

}

type Command = {
    command: string,
    callback: any
}

class Lepton {
    commands: Record<string, Command> = {};
    server: Server
    webview: Webview | undefined
    constructor() {
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
    windowInit(width: number, height: number, title: string, path: string, sizeBehavior: SizeBehavior = SizeBehavior.NONE) {
        SizeHint.FIXED

        this.webview = new Webview();

        this.webview.navigate(path);
        let size = {
            width,
            height,
            hint: sizeBehavior as unknown as SizeHint
        }

        this.webview.size = size
        this.webview.title = title;
        this.webview.bind("press", (a, b, c) => {
            console.log(a, b, c);
        });
        this.webview.run();

    }
}
export default Lepton