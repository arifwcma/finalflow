"use client";

import { useState, useEffect, useCallback } from "react";
import { MapPin, ArrowUp, Info } from "lucide-react";
import { dataCaptureSites, catchmentSites } from "@/lib/stations";
import StationModal from "./StationModal";

interface StationData {
  parameterLabel: string;
  v: number | string;
  units: string;
  dt: string;
}

interface TooltipData {
  id: string;
  name: string;
  left: string;
  top: string;
  data: StationData[] | null;
  loading: boolean;
}

interface SelectedStation {
  id: string;
  name: string;
}

export default function RiverMap() {
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  const [selectedStation, setSelectedStation] = useState<SelectedStation | null>(null);

  // Fetch station data for tooltip
  const fetchTooltipData = useCallback(async (id: string, name: string, left: string, top: string) => {
    setTooltipData({ id, name, left, top, data: null, loading: true });
    
    try {
      const res = await fetch(`/api/station/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTooltipData({ id, name, left, top, data, loading: false });
      } else {
        setTooltipData({ id, name, left, top, data: [], loading: false });
      }
    } catch (err) {
      console.error("Error fetching station data:", err);
      setTooltipData({ id, name, left, top, data: [], loading: false });
    }
  }, []);

  const handleMarkerClick = (site: { id: string; name: string; left: string; top: string }) => {
    // If clicking the same marker, close tooltip
    if (tooltipData?.id === site.id) {
      setTooltipData(null);
      return;
    }
    fetchTooltipData(site.id, site.name, site.left, site.top);
  };

  const handleMoreInfo = () => {
    if (tooltipData) {
      setSelectedStation({ id: tooltipData.id, name: tooltipData.name });
      setTooltipData(null);
    }
  };

  const closeTooltip = () => {
    setTooltipData(null);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.station-tooltip') && !target.closest('.map-dcl')) {
        setTooltipData(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getValue = (data: StationData[] | null, label: string): string => {
    if (!data) return "N/A";
    const item = data.find((d) =>
      d.parameterLabel?.toLowerCase().includes(label.toLowerCase())
    );
    if (!item || item.v === undefined || item.v === null) return "N/A";
    return `${item.v} ${item.units || ""}`;
  };

  const getLastUpdated = (data: StationData[] | null): string => {
    if (!data || data.length === 0) return "";
    const item = data[0];
    if (!item?.dt) return "";
    return new Date(item.dt).toLocaleString("en-AU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const renderTooltip = () => {
    if (!tooltipData) return null;

    return (
      <div
        className="station-tooltip absolute bg-white border border-gray-300 rounded shadow-lg z-[1000] min-w-[240px]"
        style={{
          left: tooltipData.left,
          top: `calc(${tooltipData.top} + 30px)`,
          transform: "translateX(-50%)",
        }}
      >
        {/* Header */}
        <div className="bg-[#5393ca] text-white px-3 py-2 font-semibold text-sm border-b flex justify-between items-center">
          <span>{tooltipData.name}</span>
          <button onClick={closeTooltip} className="text-white hover:text-gray-200 ml-2">×</button>
        </div>
        
        {/* Content */}
        <div className="p-3 text-sm">
          {tooltipData.loading ? (
            <div className="text-center py-4 text-gray-500">Loading...</div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                <div className="font-medium text-gray-600">Water Flow</div>
                <div>{getValue(tooltipData.data, "Stream Discharge")}</div>
                
                <div className="font-medium text-gray-600">Water Level</div>
                <div>{getValue(tooltipData.data, "Stream Water Level")}<br/><span className="text-gray-500 text-xs">metres</span></div>
                
                <div className="font-medium text-gray-600">Dissolved Oxygen</div>
                <div>{getValue(tooltipData.data, "Dissolved Oxygen")}</div>
                
                <div className="font-medium text-gray-600">Conductivity</div>
                <div>{getValue(tooltipData.data, "Conductivity")}</div>
              </div>
              
              <div className="text-gray-500 text-xs mt-3">
                Last Updated {getLastUpdated(tooltipData.data)}
              </div>
              
              <div className="text-center mt-3 pt-2 border-t">
                <button
                  onClick={handleMoreInfo}
                  className="text-[#337ab7] hover:underline flex items-center justify-center gap-1 mx-auto"
                >
                  <Info size={14} />
                  More Information
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

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
                onClick={(e) => {
                  e.stopPropagation();
                  handleMarkerClick(site);
                }}
                title={site.name}
              >
                <MapPin size={24} fill="blue" stroke="darkblue" strokeWidth={1} />
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
                  size={24}
                  fill="rgba(150, 75, 50, 0.75)"
                  stroke="rgb(100, 50, 30)"
                  strokeWidth={1}
                />
              </div>
            ))}

            {/* Tooltip */}
            {renderTooltip()}
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
        <div className="map-container relative" style={{ height: "500px" }}>
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
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkerClick(site);
                  }}
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

              {/* Tooltip */}
              {renderTooltip()}
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
                onClick={() => handleMarkerClick(site)}
              >
                <a href="#" onClick={(e) => e.preventDefault()}>
                  {site.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full Station Modal */}
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
