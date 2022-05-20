export type SupportedNfts = "image" | "video" | "audio" | "model"

export const determineNftType = (mime: string): SupportedNfts => {
  if (mime.includes("image")) return "image"
  if (mime.includes("video")) return "video"
  if (mime.includes("audio")) return "audio"
  if (mime.includes("model") || mime === "application/octet-stream")
    return "model"
  return "image" // default to image if we can't determine the type
}
