import { NextResponse } from 'next/server';

/**
 * Mock Media Upload API
 * Simulates the processing and storage of performance clips.
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Return mock metadata
    const mockId = `media_${Math.random().toString(36).substr(2, 9)}`;
    
    // For MVP demonstration, we return a working sample video
    // In a real app, this would be a URL from Cloudinary/S3
    const mockUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    const mockCid = `Qm${Math.random().toString(36).substr(2, 44)}`;

    return NextResponse.json({
      id: mockId,
      url: mockUrl,
      cid: mockCid,
      type: 'video',
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Mock upload error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
