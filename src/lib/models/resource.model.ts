import type { ObjectId } from "mongodb"

export interface Resource {
  _id?: ObjectId
  title: string
  description: string
  type: "pdf" | "document" | "guide" | "manual" | "infographic"
  category: "primeros-auxilios" | "evacuacion" | "prevencion" | "respuesta" | "otro"
  fileUrl: string
  fileSize: number // in bytes
  downloads: number
  thumbnail?: string
  tags: string[]
  status: "active" | "inactive"
  createdAt: Date
  updatedAt: Date
}

export const resourceSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "type", "category", "fileUrl", "status"],
      properties: {
        title: { bsonType: "string", minLength: 5 },
        description: { bsonType: "string", minLength: 10 },
        type: { enum: ["pdf", "document", "guide", "manual", "infographic"] },
        category: { enum: ["primeros-auxilios", "evacuacion", "prevencion", "respuesta", "otro"] },
        fileUrl: { bsonType: "string" },
        fileSize: { bsonType: "int", minimum: 0 },
        downloads: { bsonType: "int", minimum: 0 },
        thumbnail: { bsonType: "string" },
        tags: { bsonType: "array", items: { bsonType: "string" } },
        status: { enum: ["active", "inactive"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
}
