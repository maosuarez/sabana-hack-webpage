import type { ObjectId } from "mongodb"

export interface Alert {
  _id?: ObjectId
  title: string
  description: string
  type: "incendio" | "inundacion" | "terremoto" | "deslizamiento" | "otro"
  severity: "baja" | "media" | "alta" | "critica"
  location: {
    address: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  status: "active" | "in-progress" | "resolved"
  userId: ObjectId
  assignedTo?: ObjectId
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
}

export const alertSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "type", "severity", "location", "status", "userId"],
      properties: {
        title: { bsonType: "string", minLength: 3 },
        description: { bsonType: "string", minLength: 10 },
        type: { enum: ["incendio", "inundacion", "terremoto", "deslizamiento", "otro"] },
        severity: { enum: ["baja", "media", "alta", "critica"] },
        location: {
          bsonType: "object",
          required: ["address"],
          properties: {
            address: { bsonType: "string" },
            coordinates: {
              bsonType: "object",
              properties: {
                lat: { bsonType: "double" },
                lng: { bsonType: "double" },
              },
            },
          },
        },
        status: { enum: ["active", "in-progress", "resolved"] },
        userId: { bsonType: "objectId" },
        assignedTo: { bsonType: "objectId" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        resolvedAt: { bsonType: "date" },
      },
    },
  },
}
