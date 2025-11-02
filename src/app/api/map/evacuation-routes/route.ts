import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const routes = await db.collection("evacuationroutes").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ routes })
  } catch (error) {
    console.error("[v0] Error fetching evacuation routes:", error)
    return NextResponse.json({ error: "Error al obtener las rutas de evacuación" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const newRoute = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("evacuationroutes").insertOne(newRoute)

    return NextResponse.json({ success: true, routeId: result.insertedId })
  } catch (error) {
    console.error("[v0] Error creating evacuation route:", error)
    return NextResponse.json({ error: "Error al crear la ruta de evacuación" }, { status: 500 })
  }
}
