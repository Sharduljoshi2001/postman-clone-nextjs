import { NextRequest, NextResponse } from 'next/server';
import * as requestService from '../../../src/services/requestService';
//handling GET request to fetch history log
export async function GET(req: NextRequest) {
  try {
    //extracting query parameters for pagination
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    //calling service layer
    const historyData = await requestService.fetchHistory(page, limit);
    return NextResponse.json({
      status: "success",
      results: historyData.count,
      data: historyData.items,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to fetch history",
      },
      { status: 500 }
    );
  }
}