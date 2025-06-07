import { FillLayerSpecification, GeoJSONSourceSpecification, LineLayerSpecification } from "maplibre-gl"
import MAP_STYLE from "./map-style.json"

const kawkons: GeoJSONSourceSpecification = {
  type: 'geojson',
  data: '/KK_BBKSDA_PB.json'
};

const fillLayer: FillLayerSpecification = {
  id: 'kawkons-fill',
  source: 'kawkons',
  type: 'fill',
  paint: {
    'fill-outline-color': '#0040c8',
    'fill-color': '#4300FF',
    'fill-opacity': 0.3
  }
}

const lineLayer: LineLayerSpecification = {
  id: 'kawkons-outline',
  source: 'kawkons',
  type: 'line',
  paint: {
    'line-width': 2,
    'line-color': '#4300FF'
  }
}

const mapStyle = {
  ...MAP_STYLE,
  sources: {
    ...MAP_STYLE.sources,
    ['kawkons']: kawkons
  },
  layers: [...MAP_STYLE.layers, fillLayer, lineLayer]
}

export default mapStyle;
