"use client";

import {
  Map,
  GeolocateControl,
  MapLayerMouseEvent,
  MapRef,
  NavigationControl,
  ScaleControl,
  StyleSpecification,
  ViewStateChangeEvent
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useRef, useState, useMemo } from "react";
import * as turf from '@turf/turf';
import mapStyle from '../lib/map-style';
import { HoverInfo, MapTooltip } from '@/components/map-tooltips';

// Constants
const INITIAL_VIEW_STATE = {
  longitude: 132.852959,
  latitude: -2.0846023,
  zoom: 6.8
} as const;

const ANIMATION_CONFIG = {
  duration: 1000,
  padding: 40
} as const;

// Types
interface MapBounds {
  sw: [number, number];
  ne: [number, number];
}
/**
 * Interactive map component with polygon click-to-zoom, reset functionality, and tooltips
 */
export default function InteractiveMap() {
  // State
  const [cursor, setCursor] = useState<string>("grab");
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Refs
  const mapRef = useRef<MapRef>(null);

  // Memoized values
  const mapStyleMemo = useMemo(() => mapStyle as StyleSpecification, []);

  // Event handlers
  const handleMouseEnter = useCallback(() => {
    if (!isAnimating) {
      setCursor('pointer');
    }
  }, [isAnimating]);

  const handleMouseLeave = useCallback(() => {
    setCursor('grab');
    setHoverInfo(null);
  }, []);

  const handleViewStateChange = useCallback((evt: ViewStateChangeEvent) => {
    // Track animation state to prevent cursor changes during transitions
    setIsAnimating(evt.viewState.zoom !== INITIAL_VIEW_STATE.zoom);
  }, []);

  /**
   * Smoothly animates the map to the initial view state
   */
  const resetToInitialView = useCallback(() => {
    if (!mapRef.current) return;

    mapRef.current.flyTo({
      center: [INITIAL_VIEW_STATE.longitude, INITIAL_VIEW_STATE.latitude],
      zoom: INITIAL_VIEW_STATE.zoom,
      duration: ANIMATION_CONFIG.duration
    });
  }, []);

  /**
   * Calculates and fits map bounds to a given feature
   */
  const fitToFeatureBounds = useCallback((feature: GeoJSON.Feature) => {
    if (!mapRef.current || !feature.geometry) return;

    try {
      const bbox = turf.bbox(feature);
      const [minLng, minLat, maxLng, maxLat] = bbox;

      const bounds: MapBounds = {
        sw: [minLng, minLat],
        ne: [maxLng, maxLat]
      };

      mapRef.current.fitBounds([bounds.sw, bounds.ne], {
        padding: ANIMATION_CONFIG.padding,
        duration: ANIMATION_CONFIG.duration
      });
    } catch (error) {
      console.error('Error calculating feature bounds:', error);
    }
  }, []);

  /**
   * Handles map click events - zooms to polygon or resets view
   */
  const handleMapClick = useCallback((event: MapLayerMouseEvent) => {
    const hasFeatures = event.features && event.features.length > 0;

    if (hasFeatures) {
      const feature = event.features![0];
      fitToFeatureBounds(feature);
    } else {
      resetToInitialView();
    }
  }, [fitToFeatureBounds, resetToInitialView]);

  /**
   * Handles hover events to show tooltip
   */
  const handleHover = useCallback((event: MapLayerMouseEvent) => {
    const {
      features,
      point: { x, y }
    } = event;

    const hoveredFeature = features && features[0];

    if (hoveredFeature) {
      setHoverInfo({
        feature: hoveredFeature,
        x,
        y
      });
    } else {
      setHoverInfo(null);
    }
  }, []);

  return (
    <main className="relative w-screen h-screen">
      <Map
        ref={mapRef}
        initialViewState={INITIAL_VIEW_STATE}
        style={{ width: '100%', height: '100%' }}
        mapStyle={mapStyleMemo}
        interactiveLayerIds={['kawkons-fill']}
        cursor={cursor}
        onClick={handleMapClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMove={handleViewStateChange}
        onMouseMove={handleHover}
        attributionControl={false}
        cooperativeGestures={false}
      >
        <GeolocateControl
          position="top-left"
          trackUserLocation={false}
          showAccuracyCircle={false}
        />
        <NavigationControl
          position="top-left"
          showCompass={true}
          showZoom={true}
        />
        <ScaleControl
          position="bottom-left"
          maxWidth={100}
          unit="metric"
        />
      </Map>

      <MapTooltip hoverInfo={hoverInfo} />

    </main>
  );
}
