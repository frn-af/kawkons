"use client";
import Map, { MapLayerMouseEvent, MapRef, StyleSpecification } from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { useRef } from "react";
import * as turf from '@turf/turf'
import mapStyle from '../lib/map-style'

export default function Home() {
  const mapRef = useRef<MapRef>(null);

  const onClick = (event: MapLayerMouseEvent) => {

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
        mapStyle={mapStyle as StyleSpecification}
        interactiveLayerIds={["kawkons-fill"]}
        onClick={onClick}
      />

    </main>
  );
}
