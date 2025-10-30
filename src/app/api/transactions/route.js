import { NextResponse } from 'next/server';
import { callAcquiredApi } from '@/utils/acquiredService';

export async function GET() {
  try {
    const response = await callAcquiredApi(`transactions?limit=20`, {}, 'GET');
    return NextResponse.json(response?.data);
  } catch (error) {
    console.error('Acquired API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process transaction' },
      { status: 500 }
    );
  }
}
