import type { ObjectId } from "mongodb"

export interface MeetingPoint {
  _id?: ObjectId
  name: string
  type: "primary" | "secondary" | "emergency"
  address: string
  coordinates: {
    lat: number
    lng: number
  }
  capacity: number
  facilities: string[]
  accessibility: boolean
  contact: {
    phone: string
    email?: string
  }
  status: "active" | "inactive" | "maintenance"
  createdAt: Date
  updatedAt: Date
}

export const meetingPointSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "type", "address", "coordinates", "capacity", "status"],
      properties: {
        name: { bsonType: "string", minLength: 3 },
        type: { enum: ["primary", "secondary", "emergency"] },
        address: { bsonType: "string" },
        coordinates: {
          bsonType: "object",
          required: ["lat", "lng"],
          properties: {
            lat: { bsonType: "double" },
            lng: { bsonType: "double" },
          },
        },
        capacity: { bsonType: "int", minimum: 50 },
        facilities: { bsonType: "array", items: { bsonType: "string" } },
        accessibility: { bsonType: "bool" },
        contact: {
          bsonType: "object",
          required: ["phone"],
          properties: {
            phone: { bsonType: "string" },
            email: { bsonType: "string" },
          },
        },
        status: { enum: ["active", "inactive", "maintenance"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
}
