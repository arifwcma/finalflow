"use client";

import { useEffect, useState, useCallback } from "react";
import { X, Loader2 } from "lucide-react";
import FlowChart from "./FlowChart";

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
  const [flowData, setFlowData] = useState<ChartDataPoint[]>([]);
  const [waterLevelData, setWaterLevelData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch latest readings
      const latestRes = await fetch(`/api/station/${stationId}`);
      if (latestRes.ok) {
        const data = await latestRes.json();
        setLatestData(data);
      }

      // Fetch flow chart data
      const flowRes = await fetch(`/api/flow/${stationId}`);
      if (flowRes.ok) {
        const data = await flowRes.json();
        setFlowData(data);
      }

      // Fetch water level chart data
      const levelRes = await fetch(`/api/waterlevel/${stationId}`);
      if (levelRes.ok) {
        const data = await levelRes.json();
        setWaterLevelData(data);
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

  const getLastUpdated = (): string => {
    const item = latestData[0];
    if (!item?.dt) return "";
    return new Date(item.dt).toLocaleString("en-AU", {
      dateStyle: "short",
      timeStyle: "medium",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="text-lg font-semibold">{stationName}</h4>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1"
            aria-label="Close modal"
          >
            <X size={24} />
          </button>
        </div>

        <div className="modal-body">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="animate-spin mr-2" size={24} />
              <span>Loading station data...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 py-8 text-center">{error}</div>
          ) : (
            <>
              {/* Current Readings Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-md font-semibold mb-3 text-blue-700">
                  Current Readings
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Water Flow:</span>
                    <br />
                    <span className="text-gray-900">{getValue("Stream Discharge")}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Water Level:</span>
                    <br />
                    <span className="text-gray-900">{getValue("Stream Water Level")}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Dissolved Oxygen:</span>
                    <br />
                    <span className="text-gray-900">{getValue("Dissolved Oxygen")}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Conductivity:</span>
                    <br />
                    <span className="text-gray-900">{getValue("Conductivity")}</span>
                  </div>
                </div>
                {getLastUpdated() && (
                  <p className="text-xs text-gray-500 mt-3">
                    Last Updated: {getLastUpdated()}
                  </p>
                )}
              </div>

              {/* Charts */}
              <div className="space-y-4">
                <FlowChart
                  data={flowData}
                  title="Stream Discharge (Flow Rate)"
                  yAxisLabel="Flow"
                  unit="ML/d"
                  color="#3182CE"
                />

                <FlowChart
                  data={waterLevelData}
                  title="Stream Water Level"
                  yAxisLabel="Level"
                  unit="m"
                  color="#38A169"
                />
              </div>
            </>
          )}
        </div>

        <div className="modal-footer">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-700 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

