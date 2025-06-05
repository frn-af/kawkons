"use client";
import Map from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"

export default function Home() {


  return (
    <main className="relative" style={{ width: "100vw", height: "100vh" }}>
      <Map
        initialViewState={{
          longitude: 132.852959,
          latitude: -2.2846023,
          zoom: 6.7
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
      />

    </main>
  );
}
