import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await getDatabase()

    // Get active alerts count
    const alertsCollection = db.collection("alerts")
    const activeAlerts = await alertsCollection.countDocuments({ status: "active" })

    // Get total incidents this month
    const incidentsCollection = db.collection("incidents")
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const totalIncidents = await incidentsCollection.countDocuments({
      createdAt: { $gte: startOfMonth },
    })

    // Get active volunteers
    const volunteersCollection = db.collection("volunteers")
    const activeVolunteers = await volunteersCollection.countDocuments({
      status: "active",
    })

    // Get people helped
    const peopleHelped = await incidentsCollection
      .aggregate([{ $match: { status: "resolved" } }, { $group: { _id: null, total: { $sum: "$peopleAffected" } } }])
      .toArray()

    return NextResponse.json({
      activeAlerts,
      totalIncidents,
      activeVolunteers,
      peopleHelped: peopleHelped[0]?.total || 0,
    })
  } catch (error) {
    console.error("[v0] Get dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
