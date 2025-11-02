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
    const incidentsCollection = db.collection("incidents")

    // Get recent incidents
    const recentIncidents = await incidentsCollection.find({}).sort({ createdAt: -1 }).limit(10).toArray()

    // Get incidents by month
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const incidentsByMonth = await incidentsCollection
      .aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            total: { $sum: 1 },
            resolved: {
              $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] },
            },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      .toArray()

    return NextResponse.json({
      recentIncidents,
      incidentsByMonth,
    })
  } catch (error) {
    console.error("[v0] Get incidents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
