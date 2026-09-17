import express from 'express'
import { Prisma, PrismaClient } from '@/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from "bcrypt"
import "dotenv/config"
import cors from 'cors'

const app = express()

const databaseUrl = process.env.DATABASE_URL
    ?.trim()
    .replace(/^["']/, "")
    .replace(/["',]+$/, "")

if (!databaseUrl || !/^postgres(?:ql)?:\/\//.test(databaseUrl)) {
    throw new Error("DATABASE_URL must start with postgresql:// or postgres://")
}

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}))

app.use(express.json())

const adapter = new PrismaPg({
    connectionString: databaseUrl
})

const client = new PrismaClient({
    adapter,
})

app.post("/api/auth/signup", async (req, res) => {
    const body = req.body ?? {}
    const email = typeof body.email === "string" ? body.email.trim() : ""
    const name = typeof body.name === "string" ? body.name.trim() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!email || !name || !password) {
        return res.status(400).json({
            message: "Email, name, and password are required"
        })
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        await client.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                name: true
            }
        })

        return res.status(201).json({
            message: "User signed up"
        })
    } catch (e) {
        console.error("Signup failed:", e)
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            return res.status(409).json({
                message: "Email or name already exists"
            })
        }
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P1001") {
            return res.status(503).json({
                message: "Database is temporarily unavailable"
            })
        }
        return res.status(500).json({
            message: "Could not create user!"
        })
    }
})

app.post("/api/auth/signin", async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                message: "name/email and password are required",
            });
        }

        const user = await client.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { name: identifier },
                ],
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid name or password",
            });
        }

        const correctPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!correctPassword) {
            return res.status(401).json({
                message: "Invalid name or password",
            });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.error("Signin failed:", error);

        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P1001"
        ) {
            return res.status(503).json({
                message: "Database is temporarily unavailable",
            });
        }

        return res.status(500).json({
            message: "Something went wrong",
        });
    }
});

app.post("/createroom", async (req, res) => {
    const body = req.body ?? {}
    const slug = typeof body.slug === "string" ? body.slug.trim() : ""
    const adminId = typeof body.adminId === "string" ? body.adminId.trim() : ""
    const shareCode = Math.random().toString(36).substring(2, 10)

    if (!slug || !adminId) {
        return res.status(400).json({
            message: "Incorrect inputs"
        })
    }

    try {
        const room = await client.room.create({
            data: {
                slug: slug,
                adminId: adminId,
                shareCode: shareCode
            }
        })

        return res.status(201).json({
            roomId: room.id,
            shareCode: shareCode
        })
    } catch (error) {
        console.error("Create room failed:", error)
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            return res.status(409).json({
                message: "Room already exists with this name"
            })
        }

        return res.status(500).json({
            message: "Could not create room"
        })
    }

})

app.post("/joinroom", async (req, res) => {
    const shareCode = req.body.shareCode
    const userId = req.body.userId

    if (!shareCode || !userId) {
        return res.status(400).json({
            message: "shareCode and userId are required",
        })
    }
    try {
        
    
    const room = await client.room.findFirst({
        where: {
            shareCode
        }
    })
    if(!room) return res.status(401).json({
        message: "Room not found."
    })

    const updatedRoom = await client.room.update({
        where: {id: room.id},
        data: {
            members: {
                connect: { id: userId}
            }
        },
        select: {
            id: true,
            slug: true,
            shareCode: true,
        }
    })

    return res.status(200).json({
        message: "Joined room successfully",
        room: updatedRoom,
    })

    } catch (error) {
        console.error("Join room failed:", error)

        return res.status(500).json({
            message: "Could not join room",
        })
    }
})

app.get("/users/:userId/rooms", async (req, res) => {
    const { userId } = req.params

    if (!userId) {
        return res.status(400).json({
            message: "User ID is required"
        })
    }

    try {
        const allrooms = await client.room.findMany({
            where: {
                OR:[
                    { adminId: userId },
                    {
                        members: {
                            some: {
                                id : userId,
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                slug: true,
            },
            orderBy: {
                createdAt: "desc"
            }
        })

        res.json({
            allrooms
        });

    } catch (error) {
        console.error("Failed to fetch rooms:", error)
        res.status(500).json({
            message: "Failed to fetch rooms"
        });
    }
})

app.get("/chats/:slug", async (req, res) => {
    try {
        const slug = decodeURIComponent(req.params.slug)
        const messages = await client.chat.findMany({
            where: {
                room: {
                    slug,
                }
            },
            select:{
                id: true,
                message: true,
                userId: true,
                admin: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                id: "asc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/room/:slug", async (req, res) => {
    res.set("Cache-Control", "no-store");
    const slug = decodeURIComponent(req.params.slug);
    const room = await client.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

const server = app.listen(5000, () => {
    console.log("Server is running in 5000");
})

server.on("error", (error) => {
    console.error("Backend server failed:", error)
})
