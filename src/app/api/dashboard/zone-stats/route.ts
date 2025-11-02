import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const zone = searchParams.get("zone")

    if (!zone) {
      return NextResponse.json({ error: "Zone parameter is required" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const incidentsCollection = db.collection("incidents")

    // Get total incidents for the zone
    const totalIncidents = await incidentsCollection.countDocuments({
      "location.neighborhood": zone,
    })

    // Get active incidents
    const activeIncidents = await incidentsCollection.countDocuments({
      "location.neighborhood": zone,
      status: { $in: ["pending", "in_progress"] },
    })

    // Get resolved incidents
    const resolvedIncidents = await incidentsCollection.countDocuments({
      "location.neighborhood": zone,
      status: "resolved",
    })

    // Get incidents by type
    const incidentsByType = await incidentsCollection
      .aggregate([
        { $match: { "location.neighborhood": zone } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ])
      .toArray()

    // Get incidents by severity
    const incidentsBySeverity = await incidentsCollection
      .aggregate([{ $match: { "location.neighborhood": zone } }, { $group: { _id: "$severity", count: { $sum: 1 } } }])
      .toArray()

    // Get critical incidents
    const criticalIncidents = await incidentsCollection.countDocuments({
      "location.neighborhood": zone,
      severity: "critical",
    })

    // Calculate average response time (in minutes)
    const resolvedWithTime = await incidentsCollection
      .find({
        "location.neighborhood": zone,
        status: "resolved",
        resolvedAt: { $exists: true },
      })
      .toArray()

    let averageResponseTime = 0
    if (resolvedWithTime.length > 0) {
      const totalTime = resolvedWithTime.reduce((acc, incident) => {
        const created = new Date(incident.createdAt).getTime()
        const resolved = new Date(incident.resolvedAt).getTime()
        return acc + (resolved - created)
      }, 0)
      averageResponseTime = Math.round(totalTime / resolvedWithTime.length / 1000 / 60) // Convert to minutes
    }

    // Get total people affected
    const peopleAffected = await incidentsCollection
      .aggregate([
        { $match: { "location.neighborhood": zone } },
        { $group: { _id: null, total: { $sum: "$affectedPeople" } } },
      ])
      .toArray()

    // Get recent incidents (last 5)
    const recentIncidents = await incidentsCollection
      .find({ "location.neighborhood": zone })
      .sort({ createdAt: -1 })
      .limit(25)
      .toArray()

    return NextResponse.json({
      zone,
      totalIncidents,
      activeIncidents,
      resolvedIncidents,
      criticalIncidents,
      averageResponseTime,
      peopleAffected: peopleAffected[0]?.total || 0,
      incidentsByType,
      incidentsBySeverity,
      recentIncidents,
      resolutionRate: totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0,
      incidentsByNeighborhood: recentIncidents
    })
  } catch (error) {
    console.error("[v0] Error fetching zone stats:", error)
    return NextResponse.json({ error: "Error al obtener estadísticas de la zona" }, { status: 500 })
  }
}
