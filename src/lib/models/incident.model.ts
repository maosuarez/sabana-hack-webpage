import type { ObjectId } from "mongodb"

export interface Incident {
  _id?: ObjectId
  title: string
  description: string
  type: "medical" | "fire" | "flood" | "earthquake" | "accident" | "other"
  severity: "low" | "medium" | "high" | "critical"
  status: "reported" | "in-progress" | "resolved" | "closed"
  location: {
    type: "Point"
    coordinates: [number, number]
    address?: string
    city?: string
    department?: string
  }
  reporter: {
    name: string
    phone?: string
    email?: string
    userId?: ObjectId
  }
  attachments: Array<{
    url: string
    type: "image" | "video"
    fileName: string
    uploadedAt: Date
  }>
  affectedPeople?: number
  responseTeam?: {
    teamId?: string
    assignedAt?: Date
    arrivedAt?: Date
    resolvedAt?: Date
  }
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export const incidentSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "type", "severity", "location", "reporter"],
      properties: {
        title: { bsonType: "string", minLength: 3 },
        description: { bsonType: "string", minLength: 10 },
        type: { enum: ["medical", "fire", "flood", "earthquake", "accident", "other"] },
        severity: { enum: ["low", "medium", "high", "critical"] },
        status: { enum: ["reported", "in-progress", "resolved", "closed"], default: "reported" },

        location: {
          bsonType: "object",
          required: ["type", "coordinates"],
          properties: {
            type: { enum: ["Point"] },
            coordinates: {
              bsonType: "array",
              items: { bsonType: "double" },
              minItems: 2,
              maxItems: 2,
            },
            address: { bsonType: "string" },
            city: { bsonType: "string" },
            department: { bsonType: "string" },
          },
        },

        reporter: {
          bsonType: "object",
          required: ["name"],
          properties: {
            name: { bsonType: "string" },
            phone: { bsonType: "string" },
            email: { bsonType: "string" },
            userId: { bsonType: "objectId" },
          },
        },

        attachments: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["url", "type", "fileName", "uploadedAt"],
            properties: {
              url: { bsonType: "string" },
              type: { enum: ["image", "video"] },
              fileName: { bsonType: "string" },
              uploadedAt: { bsonType: "date" },
            },
          },
        },

        affectedPeople: { bsonType: "int", minimum: 0 },

        responseTeam: {
          bsonType: "object",
          properties: {
            teamId: { bsonType: "string" },
            assignedAt: { bsonType: "date" },
            arrivedAt: { bsonType: "date" },
            resolvedAt: { bsonType: "date" },
          },
        },

        notes: { bsonType: "string" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
}
