import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const stationNumber = id.replace(/[A-Za-z]/g, "");

  try {
    const url = `https://data.water.vic.gov.au/WMIS/data/anon/internet/stations/0/${stationNumber}/streamwaterlevel/latest%2012%20months.json`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch water level data from WMIS" },
        { status: response.status }
      );
    }

    const raw = await response.json();
    
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 3);
    
    const filtered = (raw.data || [])
      .map((d: [string, string]) => ({ dt: d[0], v: parseFloat(d[1]) }))
      .filter((d: { dt: string; v: number }) => new Date(d.dt) >= cutoff);

    return NextResponse.json(filtered);
  } catch (error) {
    console.error("Error fetching water level data:", error);
    return NextResponse.json(
      { error: "Failed to fetch water level data" },
      { status: 500 }
    );
  }
}

