import type { ObjectId } from "mongodb"

export interface EvacuationRoute {
  _id?: ObjectId
  name: string
  description: string
  coordinates: Array<{
    lat: number
    lng: number
    order: number
  }>
  startPoint: {
    name: string
    lat: number
    lng: number
  }
  endPoint: {
    name: string
    lat: number
    lng: number
  }
  distance: number // in meters
  estimatedTime: number // in minutes
  difficulty: "easy" | "moderate" | "difficult"
  status: "active" | "inactive" | "blocked"
  accessibility: boolean
  warnings: string[]
  createdAt: Date
  updatedAt: Date
}

export const evacuationRouteSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "coordinates", "startPoint", "endPoint", "distance", "difficulty", "status"],
      properties: {
        name: { bsonType: "string", minLength: 3 },
        description: { bsonType: "string" },
        coordinates: {
          bsonType: "array",
          minItems: 2,
          items: {
            bsonType: "object",
            required: ["lat", "lng", "order"],
            properties: {
              lat: { bsonType: "double", minimum: -90, maximum: 90 },
              lng: { bsonType: "double", minimum: -180, maximum: 180 },
              order: { bsonType: "int", minimum: 0 },
            },
          },
        },
        startPoint: {
          bsonType: "object",
          required: ["name", "lat", "lng"],
          properties: {
            name: { bsonType: "string" },
            lat: { bsonType: "double" },
            lng: { bsonType: "double" },
          },
        },
        endPoint: {
          bsonType: "object",
          required: ["name", "lat", "lng"],
          properties: {
            name: { bsonType: "string" },
            lat: { bsonType: "double" },
            lng: { bsonType: "double" },
          },
        },
        distance: { bsonType: "int", minimum: 0 },
        estimatedTime: { bsonType: "int", minimum: 0 },
        difficulty: { enum: ["easy", "moderate", "difficult"] },
        status: { enum: ["active", "inactive", "blocked"] },
        accessibility: { bsonType: "bool" },
        warnings: { bsonType: "array", items: { bsonType: "string" } },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
}
