"use client";

import { HoverInfo, MapTooltip } from "@/components/map-tooltips";
import SlidingPanel from "@/components/sliding-panel";
import * as turf from "@turf/turf";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  GeolocateControl,
  Map,
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
  ScaleControl,
  StyleSpecification,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import mapStyle from "../lib/map-style";

// Constants
const INITIAL_VIEW_STATE = {
  longitude: 132.852959,
  latitude: -2.0846023,
  zoom: 7,
} as const;

const ANIMATION_CONFIG = {
  duration: 1000,
  padding: 60,
} as const;

// Types
interface MapBounds {
  sw: [number, number];
  ne: [number, number];
}

export default function InteractiveMap() {
  const [cursor, setCursor] = useState<string>("grab");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [mouseFeature, setMouseFeature] = useState<GeoJSON.Feature | null>(
    null
  );

  const mapRef = useRef<MapRef>(null);

  const mapStyleMemo = useMemo(() => mapStyle as StyleSpecification, []);

  const handleOpenSheet = useCallback((feature: GeoJSON.Feature) => {
    if (!feature) return;
    setIsSheetOpen(true);
    setMouseFeature(feature);
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!isAnimating) {
      setCursor("pointer");
    }
  }, [isAnimating]);

  const handleMouseLeave = useCallback(() => {
    setCursor("grab");
    setHoverInfo(null);
  }, []);

  const handleViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    setIsAnimating(evt.viewState.zoom !== INITIAL_VIEW_STATE.zoom);
  }, []);

  const resetToInitialView = useCallback(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      duration: ANIMATION_CONFIG.duration,
    });
  }, []);

  const fitToFeatureBounds = useCallback((feature: GeoJSON.Feature) => {
    if (!mapRef.current || !feature.geometry) return;

    try {
      const bbox = turf.bbox(feature);
      const [minLng, minLat, maxLng, maxLat] = bbox;

      const bounds: MapBounds = {
        sw: [minLng, minLat],
        ne: [maxLng, maxLat],
      };

      mapRef.current.fitBounds([bounds.sw, bounds.ne], {
        padding: {
          top: ANIMATION_CONFIG.padding,
          bottom: ANIMATION_CONFIG.padding,
          right: 600,
          left: 10,
        },
        duration: ANIMATION_CONFIG.duration,
      });
    } catch (error) {
      console.error("Error calculating feature bounds:", error);
    }
  }, []);

  const handleSheetClose = () => {
    setIsSheetOpen(false);
  };

  const handleMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const hasFeatures = event.features && event.features.length > 0;

      if (hasFeatures) {
        const feature = event.features![0];
        fitToFeatureBounds(feature);
        handleOpenSheet(feature);
      } else {
        resetToInitialView();
        setIsSheetOpen(false);
      }
    },
    [fitToFeatureBounds, resetToInitialView, handleOpenSheet]
  );

  const handleHover = useCallback((event: MapLayerMouseEvent) => {
    const {
      features,
      point: { x, y },
    } = event;

    const hoveredFeature = features && features[0];

    if (hoveredFeature) {
      setHoverInfo({
        feature: hoveredFeature,
        x,
        y,
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  return (
    <main className="relative w-screen h-screen">
      <SlidingPanel isOpen={isSheetOpen} onClose={handleSheetClose}>
        <div className="p-4">
          {mouseFeature ? (
            <>
              <h2 className="text-lg font-semibold mb-4">
                {mouseFeature.properties?.NKWS}
              </h2>
              <div>
                <p>
                  <strong>Feature ID:</strong> {mouseFeature.id}
                </p>
                <p>
                  <strong>Properties:</strong>
                </p>
                <ul>
                  {Object.entries(mouseFeature.properties || {}).map(
                    ([key, value]) => (
                      <li key={key}>
                        {key}: {String(value)}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </>
          ) : (
            <p>No feature selected.</p>
          )}
        </div>
      </SlidingPanel>
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: "100%", height: "100%" }}
        mapStyle={mapStyleMemo}
        interactiveLayerIds={["kawkons-fill"]}
        cursor={cursor}
        onClick={handleMapClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMove={handleViewStateChange}
        onMouseMove={handleHover}
        attributionControl={false}
        cooperativeGestures={false}
      >
        <ScaleControl position="bottom-left" maxWidth={200} unit="metric" />
        <GeolocateControl
          position="bottom-left"
          trackUserLocation={false}
          showAccuracyCircle={false}
        />
        <NavigationControl
          position="bottom-left"
          showCompass={true}
          showZoom={true}
        />
      </Map>
      <MapTooltip hoverInfo={hoverInfo} />
    </main>
  );
}
