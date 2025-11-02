import type { ObjectId } from "mongodb"

export interface DashboardStat {
  _id?: ObjectId
  date: Date
  source: "internal" | "external-api" | "manual"
  metrics: {
    totalIncidents: number
    activeIncidents: number
    resolvedIncidents: number
    criticalIncidents: number
    averageResponseTime: number
    affectedPeople: number
  }
  incidentsByType: {
    medical: number
    fire: number
    flood: number
    earthquake: number
    accident: number
    other: number
  }
  incidentsBySeverity: {
    low: number
    medium: number
    high: number
    critical: number
  }
  incidentsByDepartment: Array<{
    name: string
    count: number
  }>
  responseMetrics: {
    averageAssignmentTime: number
    averageArrivalTime: number
    averageResolutionTime: number
  }
  createdAt: Date
  updatedAt: Date
}

export const dashboardStatSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["date", "source", "metrics", "incidentsByType", "incidentsBySeverity", "responseMetrics"],
      properties: {
        date: { bsonType: "date" },
        source: { enum: ["internal", "external-api", "manual"] },

        metrics: {
          bsonType: "object",
          properties: {
            totalIncidents: { bsonType: "int", minimum: 0 },
            activeIncidents: { bsonType: "int", minimum: 0 },
            resolvedIncidents: { bsonType: "int", minimum: 0 },
            criticalIncidents: { bsonType: "int", minimum: 0 },
            averageResponseTime: { bsonType: "double", minimum: 0 },
            affectedPeople: { bsonType: "int", minimum: 0 },
          },
        },

        incidentsByType: {
          bsonType: "object",
          properties: {
            medical: { bsonType: "int", minimum: 0 },
            fire: { bsonType: "int", minimum: 0 },
            flood: { bsonType: "int", minimum: 0 },
            earthquake: { bsonType: "int", minimum: 0 },
            accident: { bsonType: "int", minimum: 0 },
            other: { bsonType: "int", minimum: 0 },
          },
        },

        incidentsBySeverity: {
          bsonType: "object",
          properties: {
            low: { bsonType: "int", minimum: 0 },
            medium: { bsonType: "int", minimum: 0 },
            high: { bsonType: "int", minimum: 0 },
            critical: { bsonType: "int", minimum: 0 },
          },
        },

        incidentsByDepartment: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["name", "count"],
            properties: {
              name: { bsonType: "string" },
              count: { bsonType: "int", minimum: 0 },
            },
          },
        },

        responseMetrics: {
          bsonType: "object",
          properties: {
            averageAssignmentTime: { bsonType: "double", minimum: 0 },
            averageArrivalTime: { bsonType: "double", minimum: 0 },
            averageResolutionTime: { bsonType: "double", minimum: 0 },
          },
        },

        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
}
