import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const incidentsCollection = db.collection("incidents")
    const statsCollection = db.collection("dashboardstats")

    // Calculate metrics for today
    const [
      totalIncidents,
      activeIncidents,
      resolvedIncidents,
      criticalIncidents,
      affectedPeopleData,
      incidentsByType,
      incidentsBySeverity,
      incidentsByDepartment,
      responseMetrics,
    ] = await Promise.all([
      incidentsCollection.countDocuments({ createdAt: { $gte: today } }),
      incidentsCollection.countDocuments({
        createdAt: { $gte: today },
        status: { $in: ["reported", "in-progress"] },
      }),
      incidentsCollection.countDocuments({ createdAt: { $gte: today }, status: "resolved" }),
      incidentsCollection.countDocuments({
        createdAt: { $gte: today },
        severity: "critical",
      }),
      incidentsCollection
        .aggregate([
          { $match: { createdAt: { $gte: today } } },
          { $group: { _id: null, total: { $sum: "$affectedPeople" } } },
        ])
        .toArray(),
      incidentsCollection
        .aggregate([{ $match: { createdAt: { $gte: today } } }, { $group: { _id: "$type", count: { $sum: 1 } } }])
        .toArray(),
      incidentsCollection
        .aggregate([{ $match: { createdAt: { $gte: today } } }, { $group: { _id: "$severity", count: { $sum: 1 } } }])
        .toArray(),
      incidentsCollection
        .aggregate([
          {
            $match: {
              createdAt: { $gte: today },
              "location.department": { $exists: true },
            },
          },
          {
            $group: {
              _id: "$location.department",
              count: { $sum: 1 },
            },
          },
        ])
        .toArray(),
      incidentsCollection
        .aggregate([
          {
            $match: {
              createdAt: { $gte: today },
              status: "resolved",
              "responseTeam.assignedAt": { $exists: true },
              "responseTeam.arrivedAt": { $exists: true },
              "responseTeam.resolvedAt": { $exists: true },
            },
          },
          {
            $project: {
              assignmentTime: {
                $divide: [{ $subtract: ["$responseTeam.assignedAt", "$createdAt"] }, 60000],
              },
              arrivalTime: {
                $divide: [{ $subtract: ["$responseTeam.arrivedAt", "$responseTeam.assignedAt"] }, 60000],
              },
              resolutionTime: {
                $divide: [{ $subtract: ["$responseTeam.resolvedAt", "$responseTeam.arrivedAt"] }, 60000],
              },
            },
          },
          {
            $group: {
              _id: null,
              avgAssignment: { $avg: "$assignmentTime" },
              avgArrival: { $avg: "$arrivalTime" },
              avgResolution: { $avg: "$resolutionTime" },
            },
          },
        ])
        .toArray(),
    ])

    // Calculate average response time
    const avgResponseTime =
      responseMetrics.length > 0
        ? Math.round(
            (responseMetrics[0].avgAssignment || 0) +
              (responseMetrics[0].avgArrival || 0) +
              (responseMetrics[0].avgResolution || 0),
          )
        : 0

    // Format data
    const typeMap: any = { medical: 0, fire: 0, flood: 0, earthquake: 0, accident: 0, other: 0 }
    incidentsByType.forEach((item: any) => {
      typeMap[item._id] = item.count
    })

    const severityMap: any = { low: 0, medium: 0, high: 0, critical: 0 }
    incidentsBySeverity.forEach((item: any) => {
      severityMap[item._id] = item.count
    })

    const departmentArray = incidentsByDepartment.map((item: any) => ({
      name: item._id,
      count: item.count,
    }))

    // Create or update stat document
    await statsCollection.updateOne(
      { date: today },
      {
        $set: {
          date: today,
          source: "internal",
          metrics: {
            totalIncidents,
            activeIncidents,
            resolvedIncidents,
            criticalIncidents,
            averageResponseTime: avgResponseTime,
            affectedPeople: affectedPeopleData[0]?.total || 0,
          },
          incidentsByType: typeMap,
          incidentsBySeverity: severityMap,
          incidentsByDepartment: departmentArray,
          responseMetrics: {
            averageAssignmentTime: Math.round(responseMetrics[0]?.avgAssignment || 0),
            averageArrivalTime: Math.round(responseMetrics[0]?.avgArrival || 0),
            averageResolutionTime: Math.round(responseMetrics[0]?.avgResolution || 0),
          },
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ message: "Statistics calculated successfully" })
  } catch (error) {
    console.error("[v0] Calculate stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
