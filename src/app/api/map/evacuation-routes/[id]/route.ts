import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { db } = await connectToDatabase()

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    await db.collection("evacuation_routes").updateOne({ _id: new ObjectId(params.id) }, { $set: updateData })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating evacuation route:", error)
    return NextResponse.json({ error: "Error al actualizar la ruta de evacuación" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()
    await db.collection("evacuation_routes").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error deleting evacuation route:", error)
    return NextResponse.json({ error: "Error al eliminar la ruta de evacuación" }, { status: 500 })
  }
}
