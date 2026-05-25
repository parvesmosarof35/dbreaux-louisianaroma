import { url } from "@/store/config/envConfig";

/**
 * Upload a single card image to Cloudinary via the backend's admin endpoint.
 * Returns the resolved Cloudinary secure_url to embed in sectiontwo.cards[].image.
 *
 * Requires a valid admin JWT token — pass it from your auth state.
 */
export async function uploadCardImage(file: File, token: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${url}products/upload_image`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: fd,
    // ⚠️ Do NOT set Content-Type — browser sets it with the multipart boundary
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(
      body?.error?.message || body?.message || `Upload failed (${res.status})`
    );
  }

  const data = await res.json();
  return data.url as string;
}
