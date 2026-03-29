/**
 * Media Utility for ClipClash
 * Handles mock uploading and URL generation for performance clips.
 */

export interface MediaMetadata {
  id: string;
  url: string;
  cid?: string; // IPFS Content Identifier
  type: 'video' | 'image';
  createdAt: string;
}

/**
 * Simulates an upload to a media provider (Cloudinary/S3/IPFS)
 * @param file The file to upload (mocked as a File or Blob in frontend)
 */
export async function mockUpload(file: File): Promise<MediaMetadata> {
  // In a real implementation, this would be a multipart/form-data POST to /api/media/upload
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  return response.json();
}

/**
 * Returns a placeholder video URL if the real one is missing
 */
export function getMediaUrl(url?: string): string {
  if (!url) return 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  return url;
}
