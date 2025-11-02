import { BlobServiceClient, type ContainerClient } from "@azure/storage-blob"

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || ""
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || "sabana-hack-2025"

let containerClient: ContainerClient | null = null

export function getContainerClient(): ContainerClient {
  if (!containerClient) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    containerClient = blobServiceClient.getContainerClient(containerName)
  }
  return containerClient
}

export async function uploadFile(file: File | Buffer, fileName: string, contentType: string): Promise<string> {
  try {
    const containerClient = getContainerClient()
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)

    let buffer: Buffer
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
    } else {
      buffer = file
    }

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: { blobContentType: contentType },
    })

    return blockBlobClient.url
  } catch (error) {
    console.error("Error uploading file to Azure Blob:", error)
    throw new Error("Failed to upload file")
  }
}

export async function deleteFile(fileName: string): Promise<void> {
  try {
    const containerClient = getContainerClient()
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)
    await blockBlobClient.delete()
  } catch (error) {
    console.error("Error deleting file from Azure Blob:", error)
    throw new Error("Failed to delete file")
  }
}

export function getFileNameFromUrl(url: string): string {
  const parts = url.split("/")
  return parts[parts.length - 1]
}
