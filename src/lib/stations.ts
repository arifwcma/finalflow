// Data Capture Locations (DCL) - Blue markers with live data
export const dataCaptureSites = [
  {
    id: "415247B",
    name: "Wimmera River at Tarranyurk",
    left: "09%",
    top: "01%",
    lat: -36.203750,
    lng: 141.916944,
  },
  {
    id: "415246A",
    name: "Wimmera River at Lochiel Railway Bridge",
    left: "08%",
    top: "20%",
    lat: -36.328056,
    lng: 141.928889,
  },
  {
    id: "415256A",
    name: "Wimmera River Upstream of Dimboola (Wail)",
    left: "10%",
    top: "31%",
    lat: -36.467500,
    lng: 141.942222,
  },
  {
    id: "415200D",
    name: "Wimmera River at Horsham (Walmer)",
    left: "26.5%",
    top: "45.2%",
    lat: -36.716389,
    lng: 142.221667,
  },
  {
    id: "415251A",
    name: "MacKenzie River at McKenzie Creek Reserve",
    left: "26.7%",
    top: "51%",
    lat: -36.810556,
    lng: 142.193611,
  },
  {
    id: "415223B",
    name: "Burnt Creek at East Wonwondah",
    left: "32.5%",
    top: "59%",
    lat: -36.910833,
    lng: 142.305833,
  },
  {
    id: "415201B",
    name: "Wimmera River at Glenorchy Weir",
    left: "80%",
    top: "61%",
    lat: -36.930000,
    lng: 142.795278,
  },
  {
    id: "415203D",
    name: "Mt William Creek at Lake Lonsdale (Tail Gauge)",
    left: "67%",
    top: "70%",
    lat: -37.048333,
    lng: 142.607222,
  },
];

// Environmental Water Delivery Locations - Brown markers (location only, no data)
export const catchmentSites = [
  {
    name: "Taylor's Lake Outfall",
    left: "51%",
    top: "44%",
  },
  {
    name: "Bungalally Creek at Toolondo Channel",
    left: "31%",
    top: "57%",
  },
  {
    name: "Burnt Creek at Toolondo Channel",
    left: "35%",
    top: "56%",
  },
  {
    name: "Distribution Heads",
    left: "36%",
    top: "66%",
  },
  {
    name: "Dad and Dave Weir",
    left: "46%",
    top: "71%",
  },
  {
    name: "Lake Lonsdale Outlet",
    left: "69%",
    top: "70%",
  },
  {
    name: "Fyans Outlet Channel to Mt William Creek",
    left: "71%",
    top: "77%",
  },
];

// Get station coordinates by ID
export function getStationCoords(id: string): { lat: number; lng: number } | null {
  const station = dataCaptureSites.find((s) => s.id === id);
  if (station && station.lat && station.lng) {
    return { lat: station.lat, lng: station.lng };
  }
  return null;
}

// Extract just the station number from ID (e.g., "415247B" -> "415247")
export function getStationNumber(id: string): string {
  return id.replace(/[A-Za-z]/g, "");
}
