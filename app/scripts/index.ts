import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
})

const client = new PrismaClient({
    adapter,
})

async function queries(){
    const file = await client.file.create({
        data: {
            title: "my draw",
            userId: 1,
            createdAt: new Date()
        }
    })
}

queries()