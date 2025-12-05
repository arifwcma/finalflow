import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stationNumber = id.replace(/[A-Za-z]/g, "");

  try {
    const url = `https://data.water.vic.gov.au/WMIS/data/anon/internet/stations/0/${stationNumber}/streamflow/latest%2012%20months.json`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch flow data from WMIS" },
        { status: response.status }
      );
    }

    const raw = await response.json();
    
    // Filter to last 3 months
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 3);
    
    const filtered = (raw.data || [])
      .map((d: [string, string]) => ({ dt: d[0], v: parseFloat(d[1]) }))
      .filter((d: { dt: string; v: number }) => new Date(d.dt) >= cutoff);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error fetching flow data:", error);
    return NextResponse.json(
      { error: "Failed to fetch flow data" },
      { status: 500 }
    );
  }
}

