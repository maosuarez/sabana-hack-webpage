import type { ObjectId } from "mongodb"

export interface Video {
  _id?: ObjectId
  title: string
  description: string
  youtubeId: string
  category: "primeros-auxilios" | "evacuacion" | "prevencion" | "respuesta" | "otro"
  duration: number // in seconds
  views: number
  thumbnail: string
  tags: string[]
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export const videoSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "youtubeId", "category", "status"],
      properties: {
        title: { bsonType: "string", minLength: 5 },
        description: { bsonType: "string", minLength: 10 },
        youtubeId: { bsonType: "string", minLength: 11, maxLength: 11 },
        category: { enum: ["primeros-auxilios", "evacuacion", "prevencion", "respuesta", "otro"] },
        duration: { bsonType: "int", minimum: 0 },
        views: { bsonType: "int", minimum: 0 },
        thumbnail: { bsonType: "string" },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        status: { enum: ["active", "inactive"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
}
