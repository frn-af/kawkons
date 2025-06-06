"use client";
import Map, { MapLayerMouseEvent, MapRef, StyleSpecification } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { useEffect, useRef } from "react";
import * as turf from '@turf/turf'
import MAP_STYLE from '../lib/map-style'

export default function Home() {
  const mapRef = useRef<MapRef>(null);

  const onClick = (event: MapLayerMouseEvent) => {
    const map = mapRef.current?.getMap();
    const features = map?.queryRenderedFeatures([event.point.x, event.point.y], {
      layers: ['kawkons-fill']
    });

    if (event.features && event.features.length > 0) {
      const feature = event.features[0]
      const [minLng, minLat, maxLng, maxLat] = turf.bbox(feature)

      mapRef.current?.fitBounds(
        [
          [minLng, minLat],
          [maxLng, maxLat]
        ],
        {
          padding: 40, duration: 1000
        }
      )
    }
  }

  return (
    <main className="relative" style={{ width: "100vw", height: "100vh" }}>
      <Map
        ref={mapRef}
        initialViewState={{
          longitude: 132.852959,
          latitude: -2.0846023,
          zoom: 6.8
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle={MAP_STYLE as StyleSpecification}
        interactiveLayerIds={["kawkons-fill"]}
        onClick={onClick}
      />

    </main>
  );
}
