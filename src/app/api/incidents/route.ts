import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { uploadFile } from "@/lib/azure-blob"

export async function GET(request: NextRequest) {
  try {
    const db = await getDatabase()

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const type = searchParams.get("type")
    const severity = searchParams.get("severity")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const query: any = {}
    if (status) query.status = status
    if (type) query.type = type
    if (severity) query.severity = severity

    const incidents = await db.collection("incidents").find(query).sort({ createdAt: -1 }).limit(limit).toArray()

    return NextResponse.json({ incidents })
  } catch (error) {
    console.error("Error fetching incidents:", error)
    return NextResponse.json({ error: "Failed to fetch incidents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = await getDatabase()

    const formData = await request.formData()

    const incidentData: any = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      severity: formData.get("severity") as string,
      location: {
        type: "Point",
        coordinates: [
          Number.parseFloat(formData.get("longitude") as string),
          Number.parseFloat(formData.get("latitude") as string),
        ],
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        department: formData.get("department") as string,
      },
      reporter: {
        name: formData.get("reporterName") as string,
        phone: formData.get("reporterPhone") as string,
        email: formData.get("reporterEmail") as string,
      },
      affectedPeople: formData.get("affectedPeople") ? Number.parseInt(formData.get("affectedPeople") as string) : 0,
      notes: (formData.get("notes") as string) || "",
      status: "reported",
      attachments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Handle file uploads
    const files = formData.getAll("files") as File[]

    for (const file of files) {
      if (file && file.size > 0) {
        const timestamp = Date.now()
        const fileName = `incidents/${timestamp}-${file.name}`
        const fileType = file.type.startsWith("image/") ? "image" : "video"

        const url = await uploadFile(file, fileName, file.type)

        incidentData.attachments.push({
          url,
          type: fileType,
          fileName: file.name,
          uploadedAt: new Date(),
        })
      }
    }

    const result = await db.collection("incidents").insertOne(incidentData)
    const incident = { ...incidentData, _id: result.insertedId }

    return NextResponse.json({ incident }, { status: 201 })
  } catch (error) {
    console.error("Error creating incident:", error)
    return NextResponse.json({ error: "Failed to create incident" }, { status: 500 })
  }
}
