import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Settings } from '@/lib/models';

export async function GET() {
  try {
    await connectDB();
    const settings = await Settings.findOne({});
    
    if (!settings?.favicon) {
      // Return a default favicon
      const response = await fetch('https://via.placeholder.com/32');
      return response;
    }

    // Redirect to the favicon URL from settings
    return NextResponse.redirect(settings.favicon, { status: 307 });
  } catch (error) {
    console.error('Error serving favicon:', error);
    // Return a placeholder if error
    const response = await fetch('https://via.placeholder.com/32');
    return response;
  }
}

export const revalidate = 3600; // Revalidate every hour
