
import { getEventBySecretCode } from "@/lib/supabase-data";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ 'secret-code': string }> }
) {
  try {
    const { 'secret-code': secretCode } = await params;
    const event = await getEventBySecretCode(secretCode);
    
    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event by secret code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}
