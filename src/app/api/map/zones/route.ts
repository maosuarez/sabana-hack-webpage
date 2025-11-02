import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const db = await getDatabase()
    const zonesCollection = db.collection("riskzones")

    const zones = await zonesCollection.find({}).toArray()

    return NextResponse.json({ zones })
  } catch (error) {
    console.error("[v0] Get zones error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const db = await getDatabase()
    const zonesCollection = db.collection("riskzones")

    const result = await zonesCollection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Create zone error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
