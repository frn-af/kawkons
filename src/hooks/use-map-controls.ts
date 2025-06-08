import { ANIMATION_CONFIG, INITIAL_VIEW_STATE } from "@/constants/map-config";
import * as turf from "@turf/turf";
import { useCallback, useRef } from "react";
import { MapRef } from "react-map-gl/maplibre";

export function useMapControls() {
  const mapRef = useRef<MapRef>(null);

  const resetToInitialView = useCallback(() => {
    mapRef.current?.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      duration: ANIMATION_CONFIG.duration,
    });
  }, []);

  const fitToFeatureBounds = useCallback((feature: GeoJSON.Feature) => {
    if (!feature.geometry || !mapRef.current) return;

    try {
      const [minLng, minLat, maxLng, maxLat] = turf.bbox(feature);
      mapRef.current.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat],
        ],
        {
          padding: {
            top: ANIMATION_CONFIG.padding,
            bottom: ANIMATION_CONFIG.padding,
            right: 600,
            left: 10,
          },
          duration: ANIMATION_CONFIG.duration,
        }
      );
    } catch (error) {
      console.error("Error calculating feature bounds:", error);
    }
  }, []);

  return {
    mapRef,
    resetToInitialView,
    fitToFeatureBounds,
  };
}
