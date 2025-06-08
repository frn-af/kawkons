"use client";

import { FeatureDetail } from "@/components/feature-detail";
import { HoverInfo, MapTooltip } from "@/components/map-tooltips";
import SlidingPanel from "@/components/sliding-panel";
import { INITIAL_VIEW_STATE } from "@/constants/map-config";
import { useMapControls } from "@/hooks/use-map-controls";
import { getAllKawasan } from "@/lib/actions/kawasan";
import { Kawasan } from "@/lib/db/schema";
import debounce from "lodash.debounce";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  GeolocateControl,
  Map,
  MapLayerMouseEvent,
  NavigationControl,
  ScaleControl,
  StyleSpecification,
  ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import mapStyle from "../lib/map-style";

export default function InteractiveMap() {
  const [cursor, setCursor] = useState("grab");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] =
    useState<GeoJSON.Feature | null>(null);
  const [dataKawasan, setDataKawasan] = useState<Kawasan[] | null>(null);

  const { mapRef, resetToInitialView, fitToFeatureBounds } = useMapControls();
  const mapStyleMemo = useMemo(() => mapStyle as StyleSpecification, []);
  const debouncedSetHoverInfo = useRef(
    debounce((info: HoverInfo | null) => setHoverInfo(info), 50)
  ).current;

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await getAllKawasan();
        setDataKawasan(response.success ? response.data ?? null : null);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching kawasan data:", error);
          setDataKawasan(null);
        }
      }
    };

    fetchData();
    return () => controller.abort();
  }, []);

  const handleOpenSheet = useCallback((feature: GeoJSON.Feature) => {
    setSelectedFeature(feature);
    setIsSheetOpen(true);
  }, []);

  const handleCloseSheet = useCallback(() => setIsSheetOpen(false), []);

  const handleViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    setCursor(
      evt.viewState.zoom !== INITIAL_VIEW_STATE.zoom ? "grabbing" : "grab"
    );
  }, []);

  const handleMapClick = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0] ?? null;
      if (feature) {
        fitToFeatureBounds(feature);
        handleOpenSheet(feature);
      } else {
        resetToInitialView();
        setIsSheetOpen(false);
      }
    },
    [fitToFeatureBounds, handleOpenSheet, resetToInitialView]
  );

  const handleHover = useCallback(
    (event: MapLayerMouseEvent) => {
      const feature = event.features?.[0] ?? null;
      debouncedSetHoverInfo(
        feature ? { feature, x: event.point.x, y: event.point.y } : null
      );
    },
    [debouncedSetHoverInfo]
  );

  return (
    <main className="relative w-screen h-screen">
      <SlidingPanel isOpen={isSheetOpen} onClose={handleCloseSheet}>
        <div className="p-4">
          {isSheetOpen && selectedFeature && (
            <FeatureDetail
              dataKawasan={dataKawasan}
              selectedFeature={selectedFeature}
            />
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
        onMouseEnter={useCallback(() => setCursor("pointer"), [])}
        onMouseLeave={useCallback(() => {
          setCursor("grab");
          debouncedSetHoverInfo(null);
        }, [debouncedSetHoverInfo])}
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
        <NavigationControl position="bottom-left" showCompass showZoom />
      </Map>

      <MapTooltip hoverInfo={hoverInfo} />
    </main>
  );
}
