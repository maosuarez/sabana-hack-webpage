import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()
    const alertsCollection = db.collection("alerts")

    const alerts = await alertsCollection.find({}).sort({ createdAt: -1 }).limit(50).toArray()

    return NextResponse.json({ alerts })
  } catch (error) {
    console.error("[v0] Get alerts error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const db = await getDatabase()
    const alertsCollection = db.collection("alerts")

    const result = await alertsCollection.insertOne({
      ...data,
      status: "active",
      userId: session.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ success: true, id: result.insertedId })
  } catch (error) {
    console.error("[v0] Create alert error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
