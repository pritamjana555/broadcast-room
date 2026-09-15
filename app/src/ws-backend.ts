import { createServer } from "node:http";
import WebSocket, { WebSocketServer } from "ws";
import { getToken } from "next-auth/jwt";
import type { IncomingMessage } from "node:http";
import type { Socket } from "node:net";
import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";


const server = createServer();
const wss = new WebSocketServer({ noServer: true });
const nextAuthSecret = process.env.NEXTAUTH_SECRET;

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL
})

const client = new PrismaClient({
  adapter
})

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string
}

const users: User[] = []

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
    users.push({
      ws,
      rooms: [],
      userId: token.userId!,
    })
    wss.emit("connection", ws, request);
  });
});

wss.on("connection", (ws) => {
  ws.on("message", async (data) => {
    let parsedData: any
    try {
      if (typeof data !== "string") {
        parsedData = JSON.parse(data.toString())
      } else {
        parsedData = JSON.parse(data)
      }
    } catch (error) {
      console.log(parsedData);
    console.error("Parsing error: ",error)
    }
    try {
      if (parsedData.type === "join-room") {
        const user = users.find(x => x.ws === ws)
        user?.rooms.push(parsedData.roomId)
      }
    } catch (error) {
      console.error("Cannot join room: ", error);

    }

    try {
      if (parsedData.type === "leave-room") {
        const user = users.find(x => x.ws === ws)
        if (!user) return
        user.rooms = user.rooms.filter(x => x === parsedData.room)
      }
    } catch (error) {
      console.error("Cannot leave room: ", error);

    }

    try {

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId
        const message = parsedData.message
        const user = users.find(x => x.ws === ws)
        if (!user) return

        await client.chat.create({
          data: {
            message,
            userId: user.userId,
            roomId: Number(roomId)
          }
        })
        users.forEach(user => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(JSON.stringify({
              type: "chat",
              message: message,
              roomId
            }))
          }
        });
      }
    } catch (error) {
      console.error("Cannot send message: ",error);
      
    }
  });
});

server.listen(8080, () => {
  console.log("WebSocket server running on port 8080");
});