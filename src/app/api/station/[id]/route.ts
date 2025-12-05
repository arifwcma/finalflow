import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // Remove any letter suffix (e.g., "415247B" -> "415247")
  const stationNumber = id.replace(/[A-Za-z]/g, "");

  try {
    const url = `https://data.water.vic.gov.au/WMIS/data/anon/internet/stations/0/${stationNumber}/latest.json`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from WMIS" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching station data:", error);
    return NextResponse.json(
      { error: "Failed to fetch station data" },
      { status: 500 }
    );
  }
}

