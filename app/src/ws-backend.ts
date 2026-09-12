import { createServer } from "node:http";
import { WebSocketServer } from "ws";
import { getToken } from "next-auth/jwt";
import type { IncomingMessage } from "node:http";
import type { Socket } from "node:net";
import "dotenv/config"

const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET must be set before starting the WebSocket server");
}

server.on("upgrade", async (request: IncomingMessage, socket: Socket, head) => {
  const customBearerHeader = request.headers.bearer;

  if (!request.headers.authorization && typeof customBearerHeader === "string") {
    request.headers.authorization = customBearerHeader.startsWith("Bearer ")
      ? customBearerHeader
      : `Bearer ${customBearerHeader}`;
  }

  const token = await getToken({
    req: request as any,
    secret: nextAuthSecret,
  });

  if (!token) {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }

  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", (ws) => {
  ws.on("message", () => {
    ws.send("pong");
  });
});

server.listen(8080, () => {
  console.log("WebSocket server running on port 8080");
});