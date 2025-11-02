import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { deleteFile, getFileNameFromUrl } from "@/lib/azure-blob"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    const incident = await db.collection("incidents").findOne({ _id: new ObjectId(params.id) })

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    return NextResponse.json({ incident })
  } catch (error) {
    console.error("Error fetching incident:", error)
    return NextResponse.json({ error: "Failed to fetch incident" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    const body = await request.json()

    const result = await db.collection("incidents").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    )

    if (!result) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    return NextResponse.json({ incident: result })
  } catch (error) {
    console.error("Error updating incident:", error)
    return NextResponse.json({ error: "Failed to update incident" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { db } = await connectToDatabase()

    const incident = await db.collection("incidents").findOne({ _id: new ObjectId(params.id) })

    if (!incident) {
      return NextResponse.json({ error: "Incident not found" }, { status: 404 })
    }

    // Delete associated files from Azure Blob
    if (incident.attachments && Array.isArray(incident.attachments)) {
      for (const attachment of incident.attachments) {
        try {
          const fileName = getFileNameFromUrl(attachment.url)
          await deleteFile(fileName)
        } catch (error) {
          console.error("Error deleting file:", error)
        }
      }
    }

    await db.collection("incidents").deleteOne({ _id: new ObjectId(params.id) })

    return NextResponse.json({ message: "Incident deleted successfully" })
  } catch (error) {
    console.error("Error deleting incident:", error)
    return NextResponse.json({ error: "Failed to delete incident" }, { status: 500 })
  }
}
