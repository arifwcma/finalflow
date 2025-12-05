"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Loader2, Info, MapPin, Image } from "lucide-react";
import FlowChart from "./FlowChart";
import { getStationCoords } from "@/lib/stations";

interface StationData {
  parameterLabel: string;
  v: number | string;
  units: string;
  dt: string;
}

interface ChartDataPoint {
  dt: string;
  v: number;
}

interface StationModalProps {
  stationId: string;
  stationName: string;
  onClose: () => void;
}

export default function StationModal({
  stationId,
  stationName,
  onClose,
}: StationModalProps) {
  const [latestData, setLatestData] = useState<StationData[]>([]);
  const [waterLevelData, setWaterLevelData] = useState<ChartDataPoint[]>([]);
  const [dissolvedOxygenData, setDissolvedOxygenData] = useState<ChartDataPoint[]>([]);
  const [conductivityData, setConductivityData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const coords = getStationCoords(stationId);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [latestRes, levelRes, doRes, condRes] = await Promise.all([
        fetch(`/api/station/${stationId}`),
        fetch(`/api/waterlevel/${stationId}`),
        fetch(`/api/dissolvedoxygen/${stationId}`),
        fetch(`/api/conductivity/${stationId}`),
      ]);

      if (latestRes.ok) {
        const data = await latestRes.json();
        setLatestData(data);
      }

      if (levelRes.ok) {
        const data = await levelRes.json();
        setWaterLevelData(data);
      }

      if (doRes.ok) {
        const data = await doRes.json();
        setDissolvedOxygenData(data);
      }

      if (condRes.ok) {
        const data = await condRes.json();
        setConductivityData(data);
      }
    } catch (err) {
      console.error("Error fetching station data:", err);
      setError("Failed to load station data");
    } finally {
      setLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const getValue = (label: string): string => {
    const item = latestData.find((d) =>
      d.parameterLabel?.toLowerCase().includes(label.toLowerCase())
    );
    if (!item || item.v === undefined || item.v === null) return "N/A";
    return `${item.v} ${item.units || ""}`;
  };

  const getRawValue = (label: string): { value: string; units: string } => {
    const item = latestData.find((d) =>
      d.parameterLabel?.toLowerCase().includes(label.toLowerCase())
    );
    if (!item || item.v === undefined || item.v === null) {
      return { value: "N/A", units: "" };
    }
    return { value: String(item.v), units: item.units || "" };
  };

  const getLastUpdated = (): string => {
    const item = latestData[0];
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

  const formatCoord = (coord: number, isLat: boolean): string => {
    const abs = Math.abs(coord);
    const deg = Math.floor(abs);
    const minFloat = (abs - deg) * 60;
    const min = Math.floor(minFloat);
    const sec = ((minFloat - min) * 60).toFixed(1);
    const dir = isLat ? (coord >= 0 ? "N" : "S") : (coord >= 0 ? "E" : "W");
    return `${deg}°${min}'${sec}"${dir}`;
  };

  const googleMapsUrl = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
    : "#";

  const googleMapsEmbedUrl = coords
    ? `https://www.google.com/maps/embed/v1/place?key=REDACTED&q=${coords.lat},${coords.lng}&zoom=14`
    : "";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "900px", width: "95%" }}
      >
        {/* Header */}
        <div className="modal-header flex justify-between items-center border-b pb-3 mb-4">
          <h4 className="text-xl font-semibold text-gray-800">{stationName}</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body overflow-y-auto" style={{ maxHeight: "75vh" }}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin mr-2" size={24} />
              <span>Loading station data...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 py-8 text-center">{error}</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Summary and Charts */}
              <div className="lg:col-span-2 space-y-6">
                {/* Summary Section */}
                <div>
                  <h3 className="text-[#5393ca] font-semibold mb-3 flex items-center gap-2">
                    <Info size={18} />
                    Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 text-sm">
                    <div className="font-medium text-gray-700">Water Flow</div>
                    <div className="text-gray-900">{getValue("Stream Discharge")}</div>
                    
                    <div className="font-medium text-gray-700">Water Level</div>
                    <div className="text-gray-900">
                      {getRawValue("Stream Water Level").value}
                      {getRawValue("Stream Water Level").units && (
                        <span className="text-gray-500 block text-xs">
                          {getRawValue("Stream Water Level").units === "m" ? "metres" : getRawValue("Stream Water Level").units}
                        </span>
                      )}
                    </div>
                    
                    <div className="font-medium text-gray-700">Dissolved Oxygen</div>
                    <div className="text-gray-900">{getValue("Dissolved Oxygen")}</div>
                    
                    <div className="font-medium text-gray-700">Conductivity</div>
                    <div className="text-gray-900">{getValue("Conductivity")}</div>
                  </div>
                  {getLastUpdated() && (
                    <p className="text-xs text-gray-500 mt-3">
                      Last Updated {getLastUpdated()}
                    </p>
                  )}
                </div>

                {/* Water Level Chart */}
                <FlowChart
                  data={waterLevelData}
                  title="Water Level (Metres)"
                  yAxisLabel="Level"
                  unit="m"
                  color="#5393ca"
                />

                {/* Dissolved Oxygen Chart */}
                <FlowChart
                  data={dissolvedOxygenData}
                  title="Dissolved Oxygen (mg/L)"
                  yAxisLabel="DO"
                  unit="mg/L"
                  color="#5393ca"
                />

                {/* Conductivity Chart */}
                <FlowChart
                  data={conductivityData}
                  title="Conductivity (µS/cm)"
                  yAxisLabel="Cond"
                  unit="µS/cm"
                  color="#5393ca"
                />
              </div>

              {/* Right Column - Location and Photos */}
              <div className="space-y-6">
                {/* Location Section */}
                <div>
                  <h3 className="text-[#5393ca] font-semibold mb-3 flex items-center gap-2">
                    <MapPin size={18} />
                    Location
                  </h3>
                  {coords && (
                    <div className="border rounded overflow-hidden">
                      <div className="bg-white p-2 border-b text-sm">
                        <div className="text-gray-700 truncate">
                          {formatCoord(coords.lat, true)}...
                        </div>
                        <a 
                          href={googleMapsUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#337ab7] hover:underline text-xs"
                        >
                          View larger map
                        </a>
                      </div>
                      <div className="h-48 bg-gray-100">
                        <iframe
                          src={`https://maps.google.com/maps?q=${coords.lat},${coords.lng}&z=14&output=embed`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Station Location"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Historic Site Photos */}
                <div>
                  <h3 className="text-[#5393ca] font-semibold mb-3 flex items-center gap-2">
                    <Image size={18} />
                    Historic Site Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {/* Placeholder for site photos - in production these would come from an API */}
                    <div className="aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      <Image size={24} className="opacity-50" />
                    </div>
                    <div className="aspect-video bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                      <Image size={24} className="opacity-50" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 italic">
                    Photos not available
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-footer border-t pt-4 mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
