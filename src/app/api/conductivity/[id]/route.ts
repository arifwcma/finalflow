import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Calculate date range (last 3 months)
  const to = new Date();
  const from = new Date();
  from.setMonth(from.getMonth() - 3);

  const fromStr = from.toISOString().split("T")[0];
  const toStr = to.toISOString().split("T")[0];

  const url = `https://data.water.vic.gov.au/WMIS/cgi/webservice.exe?${JSON.stringify({
    function: "get_ts_traces",
    site_list: id,
    datasource: "A",
    varfrom: "62",
    varto: "62",
    start_time: fromStr,
    end_time: toStr,
    data_type: "mean",
    interval: "day",
    multiplier: 1,
  })}`;

  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    const data = await response.json();

    // Extract trace data
    if (data?.return?.traces?.[0]?.trace) {
      const trace = data.return.traces[0].trace;
      const chartData = trace.map((point: { t: string; v: number }) => ({
        dt: point.t,
        v: point.v,
      }));
      return NextResponse.json(chartData);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching conductivity data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

