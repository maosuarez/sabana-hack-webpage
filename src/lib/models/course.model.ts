import type { ObjectId } from "mongodb"

export interface Course {
  _id?: ObjectId
  title: string
  description: string
  category: "primeros-auxilios" | "evacuacion" | "prevencion" | "respuesta" | "otro"
  level: "basico" | "intermedio" | "avanzado"
  duration: number // in hours
  instructor: string
  thumbnail: string
  content: {
    modules: Array<{
      title: string
      description: string
      duration: number
    }>
  }
  enrollments: number
  rating: number
  status: "draft" | "published" | "archived"
  createdAt: Date
  updatedAt: Date
}

export const courseSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "description", "category", "level", "duration", "instructor", "status"],
      properties: {
        title: { bsonType: "string", minLength: 5 },
        description: { bsonType: "string", minLength: 20 },
        category: { enum: ["primeros-auxilios", "evacuacion", "prevencion", "respuesta", "otro"] },
        level: { enum: ["basico", "intermedio", "avanzado"] },
        duration: { bsonType: "int", minimum: 1 },
        instructor: { bsonType: "string" },
        thumbnail: { bsonType: "string" },
        enrollments: { bsonType: "int", minimum: 0 },
        rating: { bsonType: "double", minimum: 0, maximum: 5 },
        status: { enum: ["draft", "published", "archived"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
      },
    },
  },
}
