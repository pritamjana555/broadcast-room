import { createServer } from "node:http";
import WebSocket, { WebSocketServer } from "ws";
import { decode } from "next-auth/jwt";
import type { IncomingMessage } from "node:http";
import type { Socket } from "node:net";
import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import crypto from "node:crypto";


const PORT = process.env.RENDER
  ? Number(process.env.PORT)
  : Number(process.env.PORT1) || 8081;

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

interface SocketMessage {
  type?: string
  roomId?: number | string
  room?: number | string
  message?: unknown
  clientId?: unknown
}

const users: User[] = []

if (!nextAuthSecret) {
  throw new Error("NEXTAUTH_SECRET must be set before starting the WebSocket server");
}

server.on("upgrade", async (request: IncomingMessage, socket: Socket, head) => {
  function getCookieValue(cookieHeader: string, name: string): string | undefined {
  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}
async function getSessionToken(request: IncomingMessage) {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return null;

  const rawToken =
    getCookieValue(cookieHeader, "next-auth.session-token") ??
    getCookieValue(cookieHeader, "__Secure-next-auth.session-token");

  if (!rawToken) return null;

  try {
    return await decode({ token: rawToken, secret: nextAuthSecret! });
  } catch (error) {
    console.error("Failed to decode session token:", error);
    return null;
  }
}
  let token;
try {
  token = await getSessionToken(request);
} catch (error) {
  console.error("WebSocket authentication failed:", error);
  socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  socket.destroy();
  return;
}

if (!token) {
  console.error("WebSocket authentication rejected: no valid session token");
  socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
  socket.destroy();
  return;
}

  if (!token) {
    console.error("WebSocket authentication rejected: no NextAuth session cookie")
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
  ws.on("close", () => {
    const index = users.findIndex((user) => user.ws === ws)
    if (index !== -1) {
      users.splice(index, 1)
    }
  })

  ws.on("error", (error) => {
    console.error("WebSocket error:", error)
  })

  ws.on("message", async (data) => {
    let parsedData: SocketMessage
    try {
      if (typeof data !== "string") {
        parsedData = JSON.parse(data.toString()) as SocketMessage
      } else {
        parsedData = JSON.parse(data) as SocketMessage
      }
    } catch (error) {
      console.error("Parsing error:", error)
      ws.send(JSON.stringify({ type: "error", message: "Invalid message format" }))
      return
    }
    try {
      if (parsedData.type === "join-room") {
        const user = users.find(x => x.ws === ws)
        const roomId = String(parsedData.roomId)
        if (user && !user.rooms.includes(roomId)) {
          user.rooms.push(roomId)
        }
      }
    } catch (error) {
      console.error("Cannot join room: ", error);

    }

    try {
      if (parsedData.type === "leave-room") {
        const user = users.find(x => x.ws === ws)
        if (!user) return
        user.rooms = user.rooms.filter(x => x !== String(parsedData.roomId))
      }
    } catch (error) {
      console.error("Cannot leave room: ", error);

    }

    try {

      if (parsedData.type === "chat") {
        const roomId = Number(parsedData.roomId)
        const message = typeof parsedData.message === "string" ? parsedData.message.trim() : ""
        const clientId = typeof parsedData.clientId === "string" ? parsedData.clientId : undefined
        const user = users.find(x => x.ws === ws)
        if (!user || !Number.isInteger(roomId) || roomId <= 0 || !message) {
          ws.send(JSON.stringify({ type: "error", message: "Invalid chat data" }))
          return
        }

        const savedMessage = await client.chat.create({
          data: {
            message,
            userId: user.userId,
            roomId
          },
          select: {
            id: true,
            message: true,
            userId: true,
            admin: {
              select: {
                name: true,
              },
            },
          },
        })
        users.forEach(user => {
          if (user.rooms.includes(String(roomId))) {
            user.ws.send(JSON.stringify({
              type: "chat",
              clientId,
              ...savedMessage,
            }))
          }
        });
      }
    } catch (error) {
      console.error("Cannot send message: ",error);
      ws.send(JSON.stringify({ type: "error", message: "Message was not saved" }))
      
    }
    
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`WebSocket server running on port ${PORT}`);
});