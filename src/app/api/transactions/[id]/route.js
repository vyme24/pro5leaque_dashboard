import { NextResponse } from 'next/server';
import { callAcquiredApi } from '@/utils/acquiredService';

export async function GET(req, { params }) {
  try {
     const transactionId = params.id;

    console.log('Transaction ID:', transactionId);

    const response = await callAcquiredApi(`transactions/${transactionId}`, {}, 'GET');

    console.log('Acquired API Response:', response)

    return NextResponse.json(response);
  } catch (error) {
    console.error('Acquired API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process transaction' },
      { status: 500 }
    );
  }
}
