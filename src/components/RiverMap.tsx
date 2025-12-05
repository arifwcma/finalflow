"use client";

import { useState } from "react";
import { MapPin, ArrowUp } from "lucide-react";
import { dataCaptureSites, catchmentSites } from "@/lib/stations";
import StationModal from "./StationModal";

interface SelectedStation {
  id: string;
  name: string;
}

export default function RiverMap() {
  const [selectedStation, setSelectedStation] = useState<SelectedStation | null>(null);
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);

  return (
    <>
      {/* Desktop Map View */}
      <div className="map-container hidden md:block" style={{ height: "1622px" }}>
        {/* Map Row 1 - Top */}
        <div className="map-row map-row-1 map-top map-slice" />

        {/* Map Row 2 - Left, Main, Right */}
        <div className="map-row map-row-2">
          <div className="map-slice map-left" />
          
          <div className="map-slice map-main">
            {/* Data Capture Location Markers (Blue) */}
            {dataCaptureSites.map((site) => (
              <button
                key={site.id}
                className="map-dcl cursor-pointer hover:scale-125 transition-transform"
                style={{ left: site.left, top: site.top }}
                onClick={() => setSelectedStation({ id: site.id, name: site.name })}
                onMouseEnter={() => setHoveredMarker(site.id)}
                onMouseLeave={() => setHoveredMarker(null)}
                title={site.name}
              >
                <MapPin size={24} fill="blue" stroke="darkblue" strokeWidth={1} />
                {hoveredMarker === site.id && (
                  <div className="marker-tooltip">{site.name}</div>
                )}
              </button>
            ))}

            {/* Catchment Markers (Brown) */}
            {catchmentSites.map((site, idx) => (
              <div
                key={idx}
                className="map-catchment"
                style={{ left: site.left, top: site.top }}
                onMouseEnter={() => setHoveredMarker(`catchment-${idx}`)}
                onMouseLeave={() => setHoveredMarker(null)}
                title={site.name}
              >
                <MapPin
                  size={24}
                  fill="rgba(150, 75, 50, 0.75)"
                  stroke="rgb(100, 50, 30)"
                  strokeWidth={1}
                />
                {hoveredMarker === `catchment-${idx}` && (
                  <div className="marker-tooltip">{site.name}</div>
                )}
              </div>
            ))}
          </div>
          
          <div className="map-slice map-right" />
        </div>

        {/* Map Key */}
        <div className="map-key">
          <div className="flex items-center gap-2 my-2">
            <MapPin size={18} fill="blue" stroke="darkblue" />
            <span>Data Capture Location</span>
          </div>
          <div className="flex items-start gap-2 my-2">
            <MapPin size={18} fill="rgba(150, 75, 50, 0.75)" stroke="rgb(100, 50, 30)" />
            <div>
              <span>Environmental Water Delivery Location</span>
              <div className="text-gray-500 text-xs ml-0">(location only – no data)</div>
            </div>
          </div>
        </div>

        {/* North Arrow */}
        <div className="map-arrow">
          <ArrowUp size={24} />
          <div>N</div>
        </div>
      </div>

      {/* Mobile Map View - Shows only main section */}
      <div className="md:hidden">
        <div className="map-container" style={{ height: "500px" }}>
          <div className="map-row" style={{ height: "100%" }}>
            <div
              className="map-slice relative"
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: "url('/mapimages/map-main.png')",
              }}
            >
              {/* Data Capture Location Markers (Blue) */}
              {dataCaptureSites.map((site) => (
                <button
                  key={site.id}
                  className="map-dcl cursor-pointer"
                  style={{ left: site.left, top: site.top }}
                  onClick={() => setSelectedStation({ id: site.id, name: site.name })}
                  title={site.name}
                >
                  <MapPin size={20} fill="blue" stroke="darkblue" strokeWidth={1} />
                </button>
              ))}

              {/* Catchment Markers (Brown) */}
              {catchmentSites.map((site, idx) => (
                <div
                  key={idx}
                  className="map-catchment"
                  style={{ left: site.left, top: site.top }}
                  title={site.name}
                >
                  <MapPin
                    size={20}
                    fill="rgba(150, 75, 50, 0.75)"
                    stroke="rgb(100, 50, 30)"
                    strokeWidth={1}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Map Key */}
          <div className="map-key" style={{ right: "20px", left: "auto" }}>
            <div className="flex items-center gap-2 my-2">
              <MapPin size={16} fill="blue" stroke="darkblue" />
              <span>Data Capture Location</span>
            </div>
            <div className="flex items-start gap-2 my-2">
              <MapPin size={16} fill="rgba(150, 75, 50, 0.75)" stroke="rgb(100, 50, 30)" />
              <div>
                <span>Environmental Water Delivery</span>
                <div className="text-gray-500 text-xs">(no data)</div>
              </div>
            </div>
          </div>

          {/* North Arrow */}
          <div className="map-arrow" style={{ right: "20px", left: "auto", top: "100px" }}>
            <ArrowUp size={20} />
            <div>N</div>
          </div>
        </div>

        {/* Mobile Station List */}
        <div className="p-4">
          <h4 className="font-semibold mb-3">List of Data Capture Locations</h4>
          <ul className="station-list">
            {dataCaptureSites.map((site) => (
              <li
                key={site.id}
                className="station-list-item"
                onClick={() => setSelectedStation({ id: site.id, name: site.name })}
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  {site.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Station Modal */}
      {selectedStation && (
        <StationModal
          stationId={selectedStation.id}
          stationName={selectedStation.name}
          onClose={() => setSelectedStation(null)}
        />
      )}
    </>
  );
}

