import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getSession } from "@/lib/auth"

export async function GET() {
  try {
    const { db } = await connectToDatabase()
    const incidentsCollection = db.collection("incidents")

    const recentIncidents = await incidentsCollection.find({}).sort({ createdAt: -1 }).limit(50).toArray()

    // Get incidents by month for the last 6 months
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

    // Get incidents by type
    const incidentsByType = await incidentsCollection
      .aggregate([
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    // Get incidents by severity
    const incidentsBySeverity = await incidentsCollection
      .aggregate([
        {
          $group: {
            _id: "$severity",
            count: { $sum: 1 },
          },
        },
      ])
      .toArray()

    // Get incidents by department
    const incidentsByNeighborhood = await incidentsCollection
      .aggregate([
        { $match: { "location.neighborhood": { $exists: true, $ne: null } } },
        {
          $group: {
            _id: "$location.neighborhood",
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray()

    return NextResponse.json({
      recentIncidents,
      incidentsByMonth,
      incidentsByType,
      incidentsBySeverity,
      incidentsByNeighborhood,
    })
  } catch (error) {
    console.error("[v0] Get incidents error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
