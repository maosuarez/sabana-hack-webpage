import type { ObjectId } from "mongodb"

export interface RiskZone {
  _id?: ObjectId
  name: string
  level: "low" | "medium" | "high" | "critical"
  type: "flood" | "earthquake" | "fire" | "landslide" | "multiple"
  coordinates: {
    lat: number
    lng: number
  }
  radius: number // in meters
  population: number
  incidents: number
  description: string
  lastUpdated: Date
  createdAt: Date
}

export const riskZoneSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "level", "type", "coordinates", "radius", "population"],
      properties: {
        name: { bsonType: "string", minLength: 3 },
        level: { enum: ["low", "medium", "high", "critical"] },
        type: { enum: ["flood", "earthquake", "fire", "landslide", "multiple"] },
        coordinates: {
          bsonType: "object",
          required: ["lat", "lng"],
          properties: {
            lat: { bsonType: "double", minimum: -90, maximum: 90 },
            lng: { bsonType: "double", minimum: -180, maximum: 180 },
          },
        },
        radius: { bsonType: "int", minimum: 100 },
        population: { bsonType: "int", minimum: 0 },
        incidents: { bsonType: "int", minimum: 0 },
        description: { bsonType: "string" },
        lastUpdated: { bsonType: "date" },
        createdAt: { bsonType: "date" },
      },
    },
  },
}
