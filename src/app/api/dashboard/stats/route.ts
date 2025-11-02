import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Get current date range
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const incidentsCollection = db.collection("incidents")

    const [activeIncidents, totalIncidentsThisMonth, criticalIncidents, resolvedIncidents, totalAffectedPeople] =
      await Promise.all([
        incidentsCollection.countDocuments({ status: { $in: ["reported", "in-progress"] } }),
        incidentsCollection.countDocuments({ createdAt: { $gte: startOfMonth } }),
        incidentsCollection.countDocuments({ severity: "critical", status: { $in: ["reported", "in-progress"] } }),
        incidentsCollection.countDocuments({ status: "resolved", createdAt: { $gte: startOfMonth } }),
        incidentsCollection
          .aggregate([
            { $match: { status: "resolved" } },
            { $group: { _id: null, total: { $sum: "$affectedPeople" } } },
          ])
          .toArray(),
      ])

    // Calculate average response time
    const responseTimeData = await incidentsCollection
      .aggregate([
        {
          $match: {
            status: "resolved",
            "responseTeam.assignedAt": { $exists: true },
            "responseTeam.resolvedAt": { $exists: true },
          },
        },
        {
          $project: {
            responseTime: {
              $divide: [
                { $subtract: ["$responseTeam.resolvedAt", "$responseTeam.assignedAt"] },
                60000, // Convert to minutes
              ],
            },
          },
        },
        {
          $group: {
            _id: null,
            avgResponseTime: { $avg: "$responseTime" },
          },
        },
      ])
      .toArray()

    return NextResponse.json({
      activeAlerts: activeIncidents,
      totalIncidents: totalIncidentsThisMonth,
      criticalIncidents,
      resolvedIncidents,
      peopleHelped: totalAffectedPeople[0]?.total || 0,
      averageResponseTime: Math.round(responseTimeData[0]?.avgResponseTime || 0),
    })
  } catch (error) {
    console.error("[v0] Get dashboard stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
