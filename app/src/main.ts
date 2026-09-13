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
    const username = typeof body.username === "string" ? body.username.trim() : ""
    const password = typeof body.password === "string" ? body.password : ""

    if (!email || !username || !password) {
        return res.status(400).json({
            message: "Email, username, and password are required"
        })
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10)

        await client.user.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
                username: true
            }
        })

        return res.status(201).json({
            message: "User signed up"
        })
    } catch (e) {
        console.error("Signup failed:", e)
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            return res.status(409).json({
                message: "Email or username already exists"
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
                message: "Username/email and password are required",
            });
        }

        const user = await client.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier },
                ],
            },
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        const correctPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!correctPassword) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
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
    const slug = req.body.slug
    const adminId = req.body.adminId

    if (!slug || !adminId) {
        return res.status(400).json({
            message: "Incorrect inputs"
        })
    }

    try {
        const room = await client.room.create({
            data: {
                slug: slug,
                adminId: adminId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch (error) {
        res.status(411).json({
            message: "Room already exists with this name", error
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
                adminId: userId,
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
        res.status(500).json({
            message: "Failed to fetch rooms"
        });
    }
})

// app.post("/room/:chat", )

const server = app.listen(5000, () => {
    console.log("Server is running in 5000");
})

server.on("error", (error) => {
    console.error("Backend server failed:", error)
})
