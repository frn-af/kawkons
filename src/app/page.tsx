"use client";
import Map from "react-map-gl/maplibre"
import "maplibre-gl/dist/maplibre-gl.css"
import { Card } from "@/components/ui/card";

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
        mapStyle="https://api.maptiler.com/tiles/01974031-856e-7ff4-91f0-bef2ea41db98/tiles.json?key=4Wmdgxfv8qSnvY9vIERL"
      />

    </main>
  );
}
